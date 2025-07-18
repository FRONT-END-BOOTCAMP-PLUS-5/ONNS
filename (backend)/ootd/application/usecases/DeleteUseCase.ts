import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';

class DeleteUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(id: string, userId: number): Promise<void> {
    try {
      await this.boardRepository.delete(id, userId);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  }
}

export default DeleteUseCase;
