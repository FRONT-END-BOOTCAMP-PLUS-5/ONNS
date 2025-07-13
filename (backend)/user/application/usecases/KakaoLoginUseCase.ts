import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { IKakaoAuthService } from '../../domain/repositories/IKakaoAuthService';
import { User } from '../../domain/entities/User';

export class KakaoLoginUseCase {
  constructor(
    private kakaoAuthService: IKakaoAuthService,
    private authRepository: IAuthRepository,
  ) {}

  async execute(code: string): Promise<{ user: User; token: string }> {
    const accessToken = await this.kakaoAuthService.getAccessToken(code);

    const kakaoUserInfo = await this.kakaoAuthService.getUserInfo(accessToken);

    const user = await this.authRepository.upsertUser(kakaoUserInfo);

    const token = this.authRepository.generateJWT(user);

    return { user, token };
  }
}
