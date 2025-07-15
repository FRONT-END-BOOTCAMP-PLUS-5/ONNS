import { SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserLike, UserPost } from '../../domain/entities/User';

export class SbUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUserById(id: number): Promise<User | null> {
    const { data, error } = await this.supabase.from('user').select('*').eq('id', id).single();

    if (error || !data) return null;
    return data;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('user')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return null;
    return data;
  }

  async getUserLikes(userId: number): Promise<UserLike[]> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('post_id, user_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data;
  }

  async getUserPosts(userId: number): Promise<UserPost[]> {
    const { data, error } = await this.supabase.from('posts').select('*').eq('user_id', userId);

    if (error || !data) return [];
    return data;
  }
}
