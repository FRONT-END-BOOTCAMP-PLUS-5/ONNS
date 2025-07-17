import { SupabaseClient } from '@supabase/supabase-js';
import Board from '@/(backend)/ootd/domain/entities/Board';
import IBoardRepository from '@/(backend)/ootd/domain/repositories/IBoradRepository';
import BoardMapper from '@/(backend)/ootd/infrastructure/mapper/BoardMapper';

// Constants for better maintainability
const SEASON_MONTHS = {
  봄: [3, 5],
  여름: [6, 8],
  가을: [9, 11],
  겨울: [12, 2], // Special case handled separately
} as const;

const DEFAULT_TEMP_RANGE = 5;
const DEFAULT_POST_LIMIT = 8;

// Type for raw database response
interface RawBoardData {
  id: number;
  text: string;
  feels_like: number;
  date_created: string;
  user_id: number;
  photos?: { img_url: string }[];
  user?: {
    id: number;
    name: string;
    profile_img: string;
  };
  comments?: { count: number }[];
  likes?: { count: number }[];
}

class SbBoardRepository implements IBoardRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  // Common query builder for posts with related data
  private buildPostQuery() {
    return this.supabase.from('post').select(`
        *, 
        photos:photo(img_url), 
        user:user_id(id, name, profile_img),
        comments:comment(count),
        likes:likes(count)
      `);
  }

  // Transform raw data to Board entity with proper counts
  private transformBoardData(data: RawBoardData): Board {
    return {
      ...data,
      comment_count: data.comments?.[0]?.count || 0,
      like_count: data.likes?.[0]?.count || 0,
      comments: undefined,
      likes: undefined,
    };
  }

  // Transform array of raw data
  private transformBoardDataArray(data: RawBoardData[]): Board[] {
    return data.map((post) => this.transformBoardData(post));
  }

  // Validate user permissions for post operations
  private async validateUserPermission(postId: string, userId: number): Promise<void> {
    const { data: post, error } = await this.supabase
      .from('post')
      .select('user_id')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (error || !post) {
      throw new Error('권한이 없습니다.');
    }
  }

  // Get season date range
  private getSeasonDateRange(season: string): { startDate: string; endDate: string } {
    const now = new Date();
    const year = now.getFullYear();

    if (season === '겨울') {
      return {
        startDate: new Date(year - 1, 11, 1).toISOString(),
        endDate: new Date(year, 2, 1).toISOString(),
      };
    }

    const months = SEASON_MONTHS[season as keyof typeof SEASON_MONTHS];
    if (!months) {
      throw new Error(`Invalid season: ${season}`);
    }

    const [startMonth, endMonth] = months;
    return {
      startDate: new Date(year, startMonth - 1, 1).toISOString(),
      endDate: new Date(year, endMonth, 1).toISOString(),
    };
  }

  // Get current season based on current month
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  }

  // Post detail by ID
  async getById(id: string, myUserId: number): Promise<Board | null> {
    try {
      const { data, error } = await this.buildPostQuery().eq('id', id).single();

      if (error) throw error;
      if (!data) return null;

      return BoardMapper.toDomain(this.transformBoardData(data), myUserId);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  }

  // Create new post
  async create(
    board: Omit<
      Board,
      | 'id'
      | 'date_created'
      | 'comment_count'
      | 'like_count'
      | 'photos'
      | 'user'
      | 'comments'
      | 'likes'
    >,
    img_url?: string[],
  ): Promise<Board> {
    try {
      const insertData = {
        text: board.text,
        feels_like: board.feels_like,
        user_id: board.user_id,
      };

      const { data, error } = await this.supabase
        .from('post')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error('Failed to create post: No data returned');
      }

      // Save images if provided
      if (img_url?.length) {
        const photoData = img_url.map((imgUrl) => ({
          post_id: data.id,
          img_url: imgUrl,
        }));

        const { error: photoError } = await this.supabase.from('photo').insert(photoData);

        if (photoError) {
          throw new Error(`Failed to save photos: ${photoError.message}`);
        }
      }

      // Fetch complete post data with related information
      const { data: fullData, error: fetchError } = await this.buildPostQuery()
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Error fetching created post with photos:', fetchError);
        return data as Board;
      }

      return this.transformBoardData(fullData);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update post text content
  async update(id: string, updateData: Partial<Board>, userId: number): Promise<void> {
    try {
      await this.validateUserPermission(id, userId);

      const { error } = await this.supabase
        .from('post')
        .update({ text: updateData.text })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete post and related data
  async delete(id: string, userId: number): Promise<void> {
    try {
      await this.validateUserPermission(id, userId);

      // Delete related photos first
      await this.supabase.from('photo').delete().eq('post_id', id);

      // Delete the post
      const { error } = await this.supabase.from('post').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Get posts by season with optional filters
  async getBySeason(
    season: string,
    sort?: string,
    min?: number,
    max?: number,
    offset?: number,
    limit?: number,
  ): Promise<Board[]> {
    try {
      const { startDate, endDate } = this.getSeasonDateRange(season);

      let query = this.buildPostQuery().gte('date_created', startDate).lt('date_created', endDate);

      // Apply temperature filters
      if (typeof min === 'number') query = query.gte('feels_like', min);
      if (typeof max === 'number') query = query.lte('feels_like', max);

      // Apply pagination
      if (typeof offset === 'number' && typeof limit === 'number') {
        query = query.range(offset, offset + limit - 1);
      } else if (typeof limit === 'number') {
        query = query.limit(limit);
      }

      query = query.order('date_created', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const postsWithCounts = this.transformBoardDataArray(data || []);

      // Apply sorting if specified
      if (sort === 'popular') {
        return postsWithCounts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      }

      return postsWithCounts;
    } catch (error) {
      console.error('Error fetching posts by season:', error);
      throw error;
    }
  }

  // Get current season posts
  async getCurrentSeasonPosts(sort?: string, offset?: number, limit?: number): Promise<Board[]> {
    try {
      const currentSeason = this.getCurrentSeason();
      const posts = await this.getBySeason(
        currentSeason,
        sort,
        undefined,
        undefined,
        offset,
        limit,
      );

      // Ensure latest posts first (unless sorting by popularity)
      if (sort !== 'popular') {
        return posts.sort(
          (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
        );
      }

      return posts;
    } catch (error) {
      console.error('Error fetching current season posts:', error);
      throw error;
    }
  }

  // Get random posts
  async getRandomPosts(limit: number = DEFAULT_POST_LIMIT): Promise<Board[]> {
    try {
      const { data, error } = await this.buildPostQuery()
        .order('date_created', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return this.transformBoardDataArray(data || []);
    } catch (error) {
      console.error('Error fetching random posts:', error);
      throw error;
    }
  }

  // Get most liked posts
  async getMostLikedPosts(limit: number = DEFAULT_POST_LIMIT): Promise<Board[]> {
    try {
      const { data, error } = await this.buildPostQuery().order('date_created', {
        ascending: false,
      });

      if (error) throw error;

      const postsWithCounts = this.transformBoardDataArray(data || []);

      return postsWithCounts
        .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching most liked posts:', error);
      throw error;
    }
  }

  // Get most liked posts by temperature range
  async getMostLikedPostsByTemp(
    currentTemp: number,
    tempRange: number = DEFAULT_TEMP_RANGE,
    limit: number = DEFAULT_POST_LIMIT,
  ): Promise<Board[]> {
    try {
      const minTemp = currentTemp - tempRange;
      const maxTemp = currentTemp + tempRange;

      const { data, error } = await this.buildPostQuery()
        .gte('feels_like', minTemp)
        .lte('feels_like', maxTemp)
        .order('date_created', { ascending: false });

      if (error) throw error;

      const postsWithCounts = this.transformBoardDataArray(data || []);

      return postsWithCounts
        .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching most liked posts by temperature:', error);
      throw error;
    }
  }
}

export default SbBoardRepository;
