import { User } from '../entities/User';
import { Tokens } from '@/types/auth';

export interface IAuthRepository {
  upsertUser(user: User): Promise<User>;
  generateJWT(user: User): Tokens;
  findUserByToken(token: string): Promise<User | null>;
  deleteUser(user: User): Promise<User>;
  invalidateToken(token: string): Promise<void>;
}
