// (backend)/likes/application/usecases/PostLikesUsecase.ts
import { ILikesRepository } from '../../domain/repositories/ILikesRepository';

export class PostLikesUseCase {
  constructor(private likesRepository: ILikesRepository) {}

  async execute(
    userId: number,
    postId: number,
  ): Promise<{
    success: boolean;
    message: string;
    likeCount: number;
    isLiked: boolean;
  }> {
    try {
      const likeExists = await this.likesRepository.checkLikeExists(userId, postId);
      if (likeExists) {
        await this.likesRepository.deleteLike(userId, postId);

        // 좋아요 조회
        const likeCount = await this.likesRepository.getLikeCount(postId);

        return {
          success: true,
          message: '좋아요가 취소되었습니다.',
          likeCount,
          isLiked: false,
        };
      } else {
        await this.likesRepository.createLike(userId, postId);

        const likeCount = await this.likesRepository.getLikeCount(postId);

        return {
          success: true,
          message: '좋아요가 추가되었습니다.',
          likeCount,
          isLiked: true,
        };
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '좋아요 처리 중 오류가 발생했습니다.';
      throw new Error(message);
    }
  }
}
