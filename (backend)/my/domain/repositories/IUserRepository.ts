import { User, UserLike, UserPost } from '../entities/User';

export interface IUserRepository {
  getUserById(id: number): Promise<User | null>;
  updateUser(id: number, data: Partial<User>): Promise<User | null>;
  getUserLikes(userId: number): Promise<UserLike[]>;
  getUserPosts(userId: number): Promise<UserPost[]>;
  uploadProfileImage(
    userId: number,
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }>;
  deleteProfileImage(userId: number, imageUrl: string): Promise<boolean>;
}
