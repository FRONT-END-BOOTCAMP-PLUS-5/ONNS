import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetPostUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // Get current season posts with optional sorting
  async getCurrentSeasonPosts(myUserId: number, sort?: string): Promise<BoardWithUser[]> {
    try {
      const boards = await this.boardRepository.getCurrentSeasonPosts(sort);
      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }
}

export default GetPostUseCase;
