import { INotiRepository } from '../../domain/repositories/INotiRepository';
import { RawNotification } from '../../domain/entities/Notification';
import { supabase } from '@/utils/supabase/supabaseClient';

export class SbNotiRepository implements INotiRepository {
  async getAllNotifications(userId: number): Promise<RawNotification[]> {
    const { data, error } = await supabase
      .from('notification')
      .select(
        `
        id,
        is_read,
        actor_id,
        user_id,
        post_id,
        type,
        date_created,
        actor:user!notification_actor_id_fkey(
          id,
          name
        )
      `,
      )
      .eq('user_id', userId)
      .order('date_created', { ascending: false });

    if (error) {
      throw new Error(`알림 조회 실패: ${error.message}`);
    }

    return (data as unknown as RawNotification[]) || [];
  }

  async getUnreadCount(userId: number): Promise<number> {
    const { count, error } = await supabase
      .from('notification')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`읽지 않은 알림 개수 조회 실패: ${error.message}`);
    }

    return count || 0;
  }

  async getNotificationById(id: number): Promise<RawNotification | null> {
    const { data, error } = await supabase
      .from('notification')
      .select(
        `
        id,
        is_read,
        actor_id,
        user_id,
        post_id,
        type,
        date_created,
        actor:user!notification_actor_id_fkey(
          id,
          name
        )
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`알림 조회 실패: ${error.message}`);
    }

    return data as unknown as RawNotification;
  }

  async markAsRead(id: number): Promise<RawNotification | null> {
    const { data, error } = await supabase
      .from('notification')
      .update({ is_read: true })
      .eq('id', id)
      .select(
        `
        id,
        is_read,
        actor_id,
        user_id,
        post_id,
        type,
        date_created,
        actor:user!notification_actor_id_fkey(
          id,
          name
        )
      `,
      )
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`알림 읽음 상태 변경 실패: ${error.message}`);
    }

    return data as unknown as RawNotification;
  }
}
