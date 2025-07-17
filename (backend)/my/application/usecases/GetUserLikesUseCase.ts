import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserLike } from '../../domain/entities/User';

export class GetUserLikesUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<UserLike[]> {
    try {
      const likes = await this.userRepository.getUserLikes(userId);
      return likes;
    } catch (error) {
      console.error('Error fetching user likes:', error);
      throw error;
    }
  }
}
