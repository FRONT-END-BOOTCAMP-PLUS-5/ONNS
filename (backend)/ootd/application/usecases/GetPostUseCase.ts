import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetPostUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // 전체 글 조회 (현재 계절에 맞는 게시글만)
  async getAllPosts(myUserId: number): Promise<BoardWithUser[]> {
    try {
      const boards = await this.boardRepository.getCurrentSeasonPosts();
      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }
}

export default GetPostUseCase;
