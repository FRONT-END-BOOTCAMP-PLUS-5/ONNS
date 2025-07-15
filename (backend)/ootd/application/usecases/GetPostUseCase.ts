import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetPostUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // 현재 계절 게시글 조회
  async getAllPosts(myUserId: number, sort?: string, season?: string): Promise<BoardWithUser[]> {
    try {
      let boards;

      if (season) {
        // 특정 계절 게시글 조회
        boards = await this.boardRepository.getBySeason(season, sort);
      } else {
        // 현재 계절 게시글 조회
        boards = await this.boardRepository.getCurrentSeasonPosts(sort);
      }

      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }
}

export default GetPostUseCase;
