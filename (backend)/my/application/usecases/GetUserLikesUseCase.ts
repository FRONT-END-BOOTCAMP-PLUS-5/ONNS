import {
  IUserRepository,
  PaginationParams,
  PaginatedResponse,
  PostWithPhotos,
} from '../../domain/repositories/IUserRepository';

export class GetUserLikesUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>> {
    try {
      const result = await this.userRepository.getUserLikes(userId, pagination);
      return result;
    } catch (error) {
      console.error('Error fetching user likes:', error);
      throw error;
    }
  }
}
