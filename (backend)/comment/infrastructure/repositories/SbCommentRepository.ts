import { SupabaseClient } from '@supabase/supabase-js';
import Comment from '../../domain/entities/Comment';
import { CommentWithUser, RawCommentWithUser } from '../../application/dtos/CommentDto';
import ICommentRepository from '../../domain/repositories/ICommentRepository';
import { CommentMapper } from '../mapper/CommentMapper';

class SbCommentRepository implements ICommentRepository {
  constructor(private readonly supabase: SupabaseClient) {}
  async create(comment: Omit<Comment, 'id' | 'date_created'>): Promise<Comment> {
    const { data, error } = await this.supabase.from('comment').insert([comment]).select().single();

    if (error) {
      console.error('데이터베이스 오류입니다.', error);
      throw new Error(`생성에 실패했습니다.  ${error.message}`);
    }

    if (!data) {
      throw new Error('댓글 생성에 실패했습니다. 데이터가 없습니다.');
    }

    return data;
  }
  async getCommentByPostId(postId: number, myUserId: number): Promise<CommentWithUser[]> {
    const { data, error } = await this.supabase
      .from('comment')
      .select('*, user:user_id(id, name, profile_img)')
      .eq('post_id', postId)
      .order('date_created', { ascending: true });

    if (error) throw new Error(error.message);

    const flat: CommentWithUser[] = (data ?? []).map((c: RawCommentWithUser) =>
      CommentMapper.toDomain(c, myUserId),
    );

    const map = new Map<number, CommentWithUser>();
    flat.forEach((c) => map.set(c.id, c));
    const roots: CommentWithUser[] = [];
    flat.forEach((c) => {
      if (c.parent_id === null) {
        roots.push(c);
      } else {
        const parent = map.get(c.parent_id);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(c);
        }
        // 대댓글에는 replies 필드를 추가하지 않음
      }
    });
    return roots;
  }
  async deleteById(commentId: number, userId: number): Promise<boolean> {
    // 내가 쓴 댓글인지 먼저 확인
    const { data: parent, error: fetchError } = await this.supabase
      .from('comment')
      .select('id')
      .eq('id', commentId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !parent) {
      throw new Error('댓글이 존재하지 않거나 권한이 없습니다.');
    }

    // 댓글 + 대댓글 삭제
    const { error } = await this.supabase
      .from('comment')
      .delete()
      .or(`id.eq.${commentId},parent_id.eq.${commentId}`);

    if (error) {
      throw new Error(`댓글 삭제 실패: ${error.message}`);
    }
    return true;
  }
}
export default SbCommentRepository;
