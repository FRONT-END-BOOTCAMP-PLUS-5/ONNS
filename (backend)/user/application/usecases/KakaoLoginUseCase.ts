import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { IKakaoAuthService } from '../../domain/repositories/IKakaoAuthService';
import { User } from '../../domain/entities/User';
import { Tokens } from '@/types/auth';

export class KakaoLoginUseCase {
  constructor(
    private kakaoAuthService: IKakaoAuthService,
    private authRepository: IAuthRepository,
  ) {}

  async execute(code: string): Promise<{ user: User; tokens: Tokens }> {
    const accessToken = await this.kakaoAuthService.getAccessToken(code);

    const kakaoUserInfo = await this.kakaoAuthService.getUserInfo(accessToken);

    const user = await this.authRepository.upsertUser(kakaoUserInfo);

    const tokens = this.authRepository.generateJWT(user);

    return { user, tokens };
  }
}
