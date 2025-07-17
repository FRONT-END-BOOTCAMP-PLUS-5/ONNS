import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import Board from '../../domain/entities/Board';

class CreateUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(board: Omit<Board, 'id' | 'date_created'>, img_url?: string[]): Promise<Board> {
    try {
      const createdBoard = await this.boardRepository.create(board, img_url);
      return createdBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }
}

export default CreateUseCase;
