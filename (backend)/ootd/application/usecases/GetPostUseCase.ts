import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetPostUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // 전체 글 조회 (사용자 ID 포함)
  async getAllPosts(myUserId: number): Promise<BoardWithUser[]> {
    try {
      const boards = await this.boardRepository.getAll();

      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }
}

export default GetPostUseCase;
