import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetMostLikedPostsUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(myUserId?: number, limit: number = 8): Promise<BoardWithUser[]> {
    try {
      const boards = await this.boardRepository.getMostLikedPosts(limit);
      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching most liked posts:', error);
      throw error;
    }
  }
}

export default GetMostLikedPostsUseCase;
