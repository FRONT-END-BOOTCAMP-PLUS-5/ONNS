import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserPost } from '../../domain/entities/User';

export class GetUserPostsUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<UserPost[]> {
    try {
      const posts = await this.userRepository.getUserPosts(userId);
      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }
}
