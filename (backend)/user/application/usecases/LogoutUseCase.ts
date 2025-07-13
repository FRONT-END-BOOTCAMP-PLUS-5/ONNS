import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { SbAuthRepository } from '../../infrastructure/repositories/SbAuthRepository';

export class LogoutUseCase {
  private authRepository: IAuthRepository;

  constructor() {
    this.authRepository = new SbAuthRepository();
  }

  async execute(token: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }

      await this.authRepository.invalidateToken(token);

      return {
        success: true,
        message: '로그아웃 완료',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  }
}
