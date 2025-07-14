import { ILikesRepository } from '../../domain/repositories/ILikesRepository';

export class GetPostLikesUseCase {
  constructor(private likesRepository: ILikesRepository) {}

  async execute(
    postId: number,
    userId?: number,
  ): Promise<{
    success: boolean;
    likeCount: number;
    isLiked: boolean;
    message?: string;
  }> {
    try {
      const likeCount = await this.likesRepository.getLikeCount(postId);

      let isLiked = false;
      if (userId) {
        isLiked = await this.likesRepository.checkLikeExists(userId, postId);
      }

      return {
        success: true,
        likeCount,
        isLiked,
        message: '좋아요 정보를 성공적으로 조회했습니다.',
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '좋아요 정보 조회 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  }
}
