export interface NotificationWithUser {
  id: number;
  isRead: boolean;
  postId: number;
  type: string;
  content?: string;
  dateCreated: Date;
  actor: {
    name: string;
  };
}
