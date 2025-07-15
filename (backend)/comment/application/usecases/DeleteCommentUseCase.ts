import SbCommentRepository from '../../infrastructure/repositories/SbCommentRepository';

class DeleteCommentUseCase {
  private commentRepository: SbCommentRepository;
  constructor(commentRepository: SbCommentRepository) {
    this.commentRepository = commentRepository;
  }

  async execture(commentId: number, userId: number): Promise<boolean> {
    try {
      const isDeleted = await this.commentRepository.deleteById(commentId, userId);
      return isDeleted;
    } catch (err) {
      console.error('댓글 삭제 실패', err);
      throw err;
    }
  }
}
export default DeleteCommentUseCase;
