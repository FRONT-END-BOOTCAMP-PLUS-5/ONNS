import Comment from '../../domain/entities/Comment';
import SbCommentRepository from '../../infrastructure/repositories/SbCommentRepository';

class PostCommentUseCase {
  private commentRepository: SbCommentRepository;

  constructor(commentRepository: SbCommentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(comment: Omit<Comment, 'id' | 'date_created'>): Promise<Comment> {
    try {
      const createdComment = await this.commentRepository.create(comment);
      return createdComment;
    } catch (err) {
      console.error('댓글 생성 실패', err);
      throw err;
    }
  }
}
export default PostCommentUseCase;
