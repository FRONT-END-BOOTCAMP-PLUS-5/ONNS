import { RawNotification } from '../entities/Notification';

export interface INotiRepository {
  getAllNotifications(userId: number): Promise<RawNotification[]>;
  getUnreadCount(userId: number): Promise<number>;
  getNotificationById(id: number): Promise<RawNotification | null>;
  markAsRead(id: number): Promise<RawNotification | null>;
}
