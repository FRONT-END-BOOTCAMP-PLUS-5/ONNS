import { SupabaseClient } from '@supabase/supabase-js';
import Board from '../../domain/entities/Board';
import IBoardRepository from '../../domain/repositories/IBoradRepository';

class SbBoardRepository implements IBoardRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  // 게시글 상세 조회
  async getById(id: string): Promise<Board | null> {
    const { data, error } = await this.supabase
      .from('post')
      .select(
        `
        *, 
        photos:photo(img_url), 
        user:user_id(id, name, profile_img),
        comments:comment(count),
        likes:likes(count)
      `,
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    // 댓글 수와 좋아요 수 추가
    const postWithCounts = {
      ...data,
      comment_count: data.comments?.[0]?.count || 0,
      like_count: data.likes?.[0]?.count || 0,
    };

    delete postWithCounts.comments;
    delete postWithCounts.likes;

    return postWithCounts;
  }

  // 게시글 생성
  async create(board: Omit<Board, 'id' | 'date_created'>, img_url?: string[]): Promise<Board> {
    const { data } = await this.supabase.from('post').insert([board]).select().single();
    if (!data) {
      throw new Error('데이터 반환 없음');
    }
    console.log('성공적으로 게시글 생성:', data);

    // 이미지 저장 (있는 경우)
    if (img_url && Array.isArray(img_url) && img_url.length > 0) {
      const photoData = img_url.map((imgUrl) => ({
        post_id: data.id,
        img_url: imgUrl,
      }));
      const { error: photoError } = await this.supabase.from('photo').insert(photoData);
      if (photoError) {
        console.error('Error saving photos:', photoError);
        throw new Error(`Failed to save photos: ${photoError.message}`);
      }
      console.log('Successfully saved photos for board:', data.id);
    }

    // 게시글과 이미지를 함께 조회
    const { data: fullData, error: fetchError } = await this.supabase
      .from('post')
      .select(
        `
        *, 
        photos:photo(img_url), 
        user:user_id(id, name, profile_img),
        comments:comment(count),
        likes:likes(count)
      `,
      )
      .eq('id', data.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created board with photos:', fetchError);
      return data;
    }

    // 댓글 수와 좋아요 수 추가
    const postWithCounts = {
      ...fullData,
      comment_count: fullData.comments?.[0]?.count || 0,
      like_count: fullData.likes?.[0]?.count || 0,
    };

    // 불필요한 필드 제거
    delete postWithCounts.comments;
    delete postWithCounts.likes;

    return postWithCounts;
  }

  //게시글 수정(글 내용만 수정)
  async update(id: string, updateData: Partial<Board>, userId: number): Promise<void> {
    // 권한 확인
    const { data: post } = await this.supabase
      .from('post')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!post) {
      throw new Error('권한이 없습니다.');
    }

    // 수정 실행
    const { error } = await this.supabase
      .from('post')
      .update({ text: updateData.text })
      .eq('id', id);
    if (error) throw error;
  }

  /*게시글 삭제 */
  async delete(id: string, userId: number): Promise<void> {
    // 권한 확인
    const { data: post } = await this.supabase
      .from('post')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!post) {
      throw new Error('권한이 없습니다.');
    }

    // 이미지 삭제
    await this.supabase.from('photo').delete().eq('post_id', id);

    // 게시글 삭제
    const { error } = await this.supabase.from('post').delete().eq('id', id);
    if (error) throw error;
  }

  // 계절별 게시글 조회 (정렬 옵션 포함)
  async getBySeason(season: string, sort?: string, min?: number, max?: number): Promise<Board[]> {
    const now = new Date();
    const year = now.getFullYear();

    let startDate: string;
    let endDate: string;

    if (season === '겨울') {
      startDate = new Date(year - 1, 11, 1).toISOString();
      endDate = new Date(year, 2, 1).toISOString();
    } else {
      const seasonMap: Record<string, [number, number]> = {
        봄: [3, 5],
        여름: [6, 8],
        가을: [9, 11],
      };
      const months = seasonMap[season];
      if (!months) throw new Error('Invalid season');
      const [startMonth, endMonth] = months;
      startDate = new Date(year, startMonth - 1, 1).toISOString();
      endDate = new Date(year, endMonth, 1).toISOString();
    }

    let query = this.supabase
      .from('post')
      .select(
        `
        *, 
        photos:photo(img_url), 
        user:user_id(id, name, profile_img),
        comments:comment(count),
        likes:likes(count)
      `,
      )
      .gte('date_created', startDate)
      .lt('date_created', endDate);

    // 온도 필터 적용
    if (typeof min === 'number') query = query.gte('feels_like', min);
    if (typeof max === 'number') query = query.lte('feels_like', max);

    query = query.order('date_created', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // 각 게시글에 댓글 수와 좋아요 수 추가
    const postsWithCounts = data.map((post) => ({
      ...post,
      comment_count: post.comments?.[0]?.count || 0,
      like_count: post.likes?.[0]?.count || 0,
      comments: undefined,
      likes: undefined,
    }));

    if (sort === 'popular') {
      return postsWithCounts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    }

    return postsWithCounts;
  }

  // 현재 계절에 맞는 게시글 조회
  async getCurrentSeasonPosts(
    sort?: string,
    season?: string,
    min?: number,
    max?: number,
  ): Promise<Board[]> {
    let targetSeason = season;
    if (!targetSeason) {
      const now = new Date();
      const month = now.getMonth() + 1;
      if (month >= 3 && month <= 5) {
        targetSeason = '봄';
      } else if (month >= 6 && month <= 8) {
        targetSeason = '여름';
      } else if (month >= 9 && month <= 11) {
        targetSeason = '가을';
      } else {
        targetSeason = '겨울';
      }
    }

    const posts = await this.getBySeason(targetSeason, sort, min, max);
    if (sort !== 'popular') {
      return posts.sort(
        (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
      );
    }
    return posts;
  }
}

export default SbBoardRepository;
