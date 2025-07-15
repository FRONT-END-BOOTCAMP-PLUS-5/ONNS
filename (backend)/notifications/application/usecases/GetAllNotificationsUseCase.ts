import { INotiRepository } from '../../domain/repositories/INotiRepository';
import { NotificationWithUser } from '../dtos/NotificationDto';

const generateNotificationContent = (type: string, actorName: string): string => {
  switch (type) {
    case 'comment':
      return `${actorName}님이 당신의 게시글에 댓글을 달았습니다.`;
    case 'reply':
      return `${actorName}님이 당신의 댓글에 대댓글을 달았습니다.`;
    case 'like':
      return `${actorName}님이 당신의 게시글에 좋아요를 남겼습니다.`;
    default:
      return '새로운 알림이 있습니다.';
  }
};

export class GetAllNotificationsUseCase {
  constructor(private notificationRepository: INotiRepository) {}

  async execute(userId: number): Promise<NotificationWithUser[]> {
    // 모든 알림 조회
    const notifications = await this.notificationRepository.getAllNotifications(userId);

    // DTO 변환 &메시지 생성
    return notifications.map((n) => ({
      id: n.id,
      isRead: n.is_read,
      postId: n.post_id,
      type: n.type,
      dateCreated: n.date_created,
      actor: {
        name: n.actor.name,
      },
      content: generateNotificationContent(n.type, n.actor.name),
    }));
  }
}
