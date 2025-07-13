import SbCommentRepository from '../../infrastructure/repositories/SbCommentRepository';
import { CommentWithUser } from '../dtos/CommentDto';

class GetCommentUseCase {
  private commentRepository: SbCommentRepository;

  constructor(commentRepository: SbCommentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(postId: number, myUserId: number): Promise<CommentWithUser[]> {
    try {
      const comments = await this.commentRepository.getCommentByPostId(postId, myUserId);
      return comments;
    } catch (err) {
      console.error('댓글 조회 실패', err);
      throw err;
    }
  }
}

export default GetCommentUseCase;
