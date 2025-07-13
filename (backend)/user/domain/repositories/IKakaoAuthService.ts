import { User } from '../entities/User';

export interface IKakaoAuthService {
  getAccessToken(code: string): Promise<string>;
  getUserInfo(accessToken: string): Promise<User>;
}
//토큰, 사용자정보
