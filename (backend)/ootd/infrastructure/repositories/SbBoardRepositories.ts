import { SupabaseClient } from '@supabase/supabase-js';
import Board from '@/(backend)/ootd/domain/entities/Board';
import IBoardRepository from '@/(backend)/ootd/domain/repositories/IBoradRepository';
import BoardMapper from '@/(backend)/ootd/infrastructure/mapper/BoardMapper';

// 유지보수를 위한 상수
const SEASON_MONTHS = {
  봄: [3, 5],
  여름: [6, 8],
  가을: [9, 11],
  겨울: [12, 2], // 겨울은 별도 처리
} as const;

const DEFAULT_TEMP_RANGE = 5;
const DEFAULT_POST_LIMIT = 8;

// 데이터베이스 응답 타입
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

  // 게시글 및 연관 데이터 쿼리 빌더
  private buildPostQuery() {
    return this.supabase.from('post').select(`
        *, 
        photos:photo(img_url), 
        user:user_id(id, name, profile_img),
        comments:comment(count),
        likes:likes(count)
      `);
  }

  // 원시 데이터를 Board 엔티티로 변환
  private transformBoardData(data: RawBoardData): Board {
    return {
      ...data,
      comment_count: data.comments?.[0]?.count || 0,
      like_count: data.likes?.[0]?.count || 0,
      comments: undefined,
      likes: undefined,
    };
  }

  // 원시 데이터 배열을 Board 엔티티 배열로 변환
  private transformBoardDataArray(data: RawBoardData[]): Board[] {
    return data.map((post) => this.transformBoardData(post));
  }

  // 게시글 작업 권한 검증
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

  // 계절에 따른 날짜 범위 반환
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
      throw new Error(`잘못된 계절: ${season}`);
    }

    const [startMonth, endMonth] = months;
    return {
      startDate: new Date(year, startMonth - 1, 1).toISOString(),
      endDate: new Date(year, endMonth, 1).toISOString(),
    };
  }

  // 현재 월을 기준으로 현재 계절 반환
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) return '봄';
    if (month >= 6 && month <= 8) return '여름';
    if (month >= 9 && month <= 11) return '가을';
    return '겨울';
  }

  // 게시글 ID로 상세 조회
  async getById(id: string, myUserId: number): Promise<Board | null> {
    try {
      const { data, error } = await this.buildPostQuery().eq('id', id).single();

      if (error) throw error;
      if (!data) return null;

      return BoardMapper.toDomain(this.transformBoardData(data), myUserId);
    } catch (error) {
      console.error('ID로 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 게시글 생성
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
        throw new Error('게시글 생성 실패: 데이터 없음');
      }

      // 이미지가 있으면 저장
      if (img_url?.length) {
        const photoData = img_url.map((imgUrl) => ({
          post_id: data.id,
          img_url: imgUrl,
        }));

        const { error: photoError } = await this.supabase.from('photo').insert(photoData);

        if (photoError) {
          throw new Error(`사진 저장 실패: ${photoError.message}`);
        }
      }

      // 연관 정보 포함 전체 게시글 데이터 조회
      const { data: fullData, error: fetchError } = await this.buildPostQuery()
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('사진 포함 게시글 조회 오류:', fetchError);
        return data as Board;
      }

      return this.transformBoardData(fullData);
    } catch (error) {
      console.error('게시글 생성 오류:', error);
      throw error;
    }
  }

  // 게시글 내용 수정
  async update(id: string, updateData: Partial<Board>, userId: number): Promise<void> {
    try {
      await this.validateUserPermission(id, userId);

      const { error } = await this.supabase
        .from('post')
        .update({ text: updateData.text })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      throw error;
    }
  }

  // 게시글 및 연관 데이터 삭제
  async delete(id: string, userId: number): Promise<void> {
    try {
      await this.validateUserPermission(id, userId);

      // 연관 사진 먼저 삭제
      await this.supabase.from('photo').delete().eq('post_id', id);

      // 게시글 삭제
      const { error } = await this.supabase.from('post').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      throw error;
    }
  }

  // 계절 및 온도(옵션)로 게시글 조회
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

      // 온도 필터 적용
      const minNum = Number(min);
      const maxNum = Number(max);
      if (!isNaN(minNum)) query = query.gte('feels_like', minNum);
      if (!isNaN(maxNum)) query = query.lte('feels_like', maxNum);

      // 페이지네이션 적용
      if (typeof offset === 'number' && typeof limit === 'number') {
        query = query.range(offset, offset + limit - 1);
      } else if (typeof limit === 'number') {
        query = query.limit(limit);
      }

      query = query.order('date_created', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      const postsWithCounts = this.transformBoardDataArray(data || []);

      // 인기순 정렬
      if (sort === 'popular') {
        return postsWithCounts.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      }

      return postsWithCounts;
    } catch (error) {
      console.error('계절별 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 현재 계절 게시글 조회
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

      // 최신순 정렬(인기순이 아니면)
      if (sort !== 'popular') {
        return posts.sort(
          (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
        );
      }

      return posts;
    } catch (error) {
      console.error('현재 계절 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 랜덤 게시글 조회
  async getRandomPosts(limit: number = DEFAULT_POST_LIMIT): Promise<Board[]> {
    try {
      const { data, error } = await this.buildPostQuery()
        .order('date_created', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return this.transformBoardDataArray(data || []);
    } catch (error) {
      console.error('랜덤 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 인기 게시글 조회
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
      console.error('인기 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 온도 범위로 인기 게시글 조회
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
      console.error('온도별 인기 게시글 조회 오류:', error);
      throw error;
    }
  }

  // 계절+온도 범위로 게시글 조회
  async getByTempRange(
    season: string,
    minTemp: number,
    maxTemp: number,
    offset: number = 0,
    limit: number = DEFAULT_POST_LIMIT,
  ): Promise<Board[]> {
    try {
      const { data, error } = await this.buildPostQuery()
        .eq('season', season)
        .gte('feels_like', minTemp)
        .lte('feels_like', maxTemp)
        .order('date_created', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const postsWithCounts = this.transformBoardDataArray(data || []);
      return postsWithCounts;
    } catch (error) {
      console.error('계절+온도 범위 게시글 조회 오류:', error);
      throw error;
    }
  }
}

export default SbBoardRepository;
