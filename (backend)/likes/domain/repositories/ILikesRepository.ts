// (backend)/likes/domain/repositories/ILikesRepository.ts
import { Likes } from '../entities/Likes';

export interface ILikesRepository {
  createLike(userId: number, postId: number): Promise<Likes>;
  deleteLike(userId: number, postId: number): Promise<void>;
  checkLikeExists(userId: number, postId: number): Promise<boolean>;
  getLikeCount(postId: number): Promise<number>;
}
