export interface JWTPayload {
  id: number;
  name: string;
  profile_img: string;
  iat?: number;
  exp?: number;
}
