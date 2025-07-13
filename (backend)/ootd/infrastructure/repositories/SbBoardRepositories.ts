import { SupabaseClient } from '@supabase/supabase-js';
import Board from '../../domain/entities/Board';
import IBoardRepository from '../../domain/repositories/IBoradRepository';

class SbBoardRepository implements IBoardRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  // 게시글 조회 (최신순 정렬)
  async getAll(): Promise<Board[]> {
    const { data, error } = await this.supabase
      .from('post')
      .select(`*, photos:photo(img_url), user:user_id(id, name, profile_img)`)
      .order('date_created', { ascending: false });
    if (error) throw error;
    return data;
  }

  // 게시글 상세 조회
  async getById(id: string): Promise<Board | null> {
    const { data, error } = await this.supabase
      .from('post')
      .select(`*, photos:photo(img_url), user:user_id(id, name, profile_img)`)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
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
      .select(`*, photos:photo(img_url), user:user_id(id, name, profile_img)`)
      .eq('id', data.id)
      .single();
    if (fetchError) {
      console.error('Error fetching created board with photos:', fetchError);
      return data;
    }
    return fullData;
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

  // 계절별 게시글 조회 (최신순 정렬)
  async getBySeason(season: string): Promise<Board[]> {
    const { data, error } = await this.supabase
      .from('post')
      .select(`*, photos:photo(img_url), user:user_id(id, name, profile_img)`)
      .order('date_created', { ascending: false });
    if (error) throw error;

    // 생성 날짜 기준으로 계절 필터링
    return data.filter((post) => {
      const createdDate = new Date(post.date_created);
      const createdMonth = createdDate.getMonth() + 1;

      let postSeason: string;
      if (createdMonth >= 3 && createdMonth <= 5) {
        postSeason = '봄';
      } else if (createdMonth >= 6 && createdMonth <= 8) {
        postSeason = '여름';
      } else if (createdMonth >= 9 && createdMonth <= 11) {
        postSeason = '가을';
      } else {
        postSeason = '겨울';
      }

      return postSeason === season;
    });
  }
}

export default SbBoardRepository;
