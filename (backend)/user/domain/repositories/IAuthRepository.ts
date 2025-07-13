import { User } from '../entities/User';
export interface IAuthRepository {
  upsertUser(user: User): Promise<User>;
  generateJWT(user: User): string;
  findUserByToken(token: string): Promise<User | null>;
  deleteUser(user: User): Promise<User>;
  invalidateToken(token: string): Promise<void>;
}
