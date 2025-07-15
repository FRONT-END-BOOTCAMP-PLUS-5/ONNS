import { INotiRepository } from '../../domain/repositories/INotiRepository';

export class UpdateNotificationReadUseCase {
  constructor(private notificationRepository: INotiRepository) {}

  async execute(
    notificationId: number,
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 알림이 존재하고 해당 사용자의 것인지 확인
      const notification = await this.notificationRepository.getNotificationById(notificationId);

      if (!notification) {
        throw new Error('알림을 찾을 수 없습니다.');
      }

      if (notification.user_id !== userId) {
        throw new Error('해당 알림에 대한 권한이 없습니다.');
      }

      // 알림을 읽음 처리
      await this.notificationRepository.markAsRead(notificationId);

      return {
        success: true,
        message: '알림이 읽음 처리되었습니다.',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '알림 읽음 처리 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  }
}
