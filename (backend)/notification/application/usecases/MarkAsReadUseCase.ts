import { INotiRepository } from '../../domain/repositories/INotiRepository';

export class MarkAsReadUseCase {
  constructor(private notificationRepository: INotiRepository) {}

  async execute(id: number): Promise<void> {
    const notification = await this.notificationRepository.getNotificationById(id);
    if (!notification) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    const result = await this.notificationRepository.markAsRead(id);
    if (!result) {
      throw new Error('알림 읽음 처리에 실패했습니다.');
    }
  }
}
