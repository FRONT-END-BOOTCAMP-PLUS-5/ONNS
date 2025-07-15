import { INotiRepository } from '../../domain/repositories/INotiRepository';

export class GetUnreadCountUseCase {
  constructor(private notificationRepository: INotiRepository) {}

  async execute(userId: number): Promise<boolean> {
    const count = await this.notificationRepository.getUnreadCount(userId);
    return count > 0;
    // 읽지 않은 알림이 있으면 true, 없으면 false로 반환환
  }
}
