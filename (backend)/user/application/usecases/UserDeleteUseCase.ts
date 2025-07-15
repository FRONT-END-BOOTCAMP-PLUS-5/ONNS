import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { SbAuthRepository } from '../../infrastructure/repositories/SbAuthRepository';

export class UserDeleteUseCase {
  private authRepository: IAuthRepository;

  constructor() {
    this.authRepository = new SbAuthRepository();
  }

  async execute(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.authRepository.findUserByToken(token);
      if (!user) {
        throw new Error('유효하지 않은 토큰입니다.');
      }

      await this.authRepository.deleteUser(user);

      await this.authRepository.invalidateToken(token);

      return {
        success: true,
        message: '회원탈퇴가 완료되었습니다.',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원탈퇴 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  }
}
