import {
  IUserRepository,
  PaginationParams,
  PaginatedResponse,
  PostWithPhotos,
} from '../../domain/repositories/IUserRepository';

export class GetUserPostsUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>> {
    try {
      const result = await this.userRepository.getUserPosts(userId, pagination);
      return result;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }
}
