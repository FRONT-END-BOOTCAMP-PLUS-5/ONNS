export interface Notification {
  id: number;
  isRead: boolean;
  actorId: number;
  userId: number;
  postId: number;
  type: string;
  content?: string;
}

export interface RawNotification {
  id: number;
  is_read: boolean;
  actor_id: number;
  user_id: number;
  post_id: number;
  type: string;
  date_created: Date;
  actor: { id: number; name: string };
}
