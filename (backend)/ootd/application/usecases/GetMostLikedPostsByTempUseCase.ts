import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

class GetMostLikedByTempUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(
    myUserId: number | undefined,
    currentTemp: number,
    limit: number = 8,
  ): Promise<BoardWithUser[]> {
    try {
      // ±5도 범위 내에서 가장 좋아요가 많은 게시글 조회
      const tempRange = 5;
      const boards = await this.boardRepository.getMostLikedPostsByTemp(
        currentTemp,
        tempRange,
        limit,
      );
      return boards.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching most liked posts by temperature:', error);
      throw error;
    }
  }
}

export default GetMostLikedByTempUseCase;
