import { ILikesRepository } from '../../domain/repositories/ILikesRepository';
import { Likes } from '../../domain/entities/Likes';
import { supabase } from '@/utils/supabase/supabaseClient';

export class SbLikesRepository implements ILikesRepository {
  async createLike(userId: number, postId: number): Promise<Likes> {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create like: ${error.message}`);
    }

    return {
      userId: data.user_id,
      postId: data.post_id,
    };
  }

  async deleteLike(userId: number, postId: number): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      throw new Error(`Failed to delete like: ${error.message}`);
    }
  }

  async checkLikeExists(userId: number, postId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116= 데이터가 없을 때
      throw new Error(`Failed to check like existence: ${error.message}`);
    }

    return !!data;
  }

  async getLikeCount(postId: number): Promise<number> {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) {
      throw new Error(`Failed to get like count: ${error.message}`);
    }

    return count || 0;
  }
}
