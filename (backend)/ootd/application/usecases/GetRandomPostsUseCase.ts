import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetRandomPostsUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(myUserId: number, limit: number = 5): Promise<BoardWithUser[]> {
    try {
      const boards = await this.boardRepository.getRandomPosts(limit);
      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching random posts:', error);
      throw error;
    }
  }
}

export default GetRandomPostsUseCase;
