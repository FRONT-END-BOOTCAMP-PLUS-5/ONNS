import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import Board from '../../domain/entities/Board';

class SeasonUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // 계절별 게시글 조회
  async getPostsBySeason(
    season: string,
    sort?: string,
    min?: number,
    max?: number,
  ): Promise<Board[]> {
    try {
      const boards = await this.boardRepository.getBySeason(season, sort, min, max);
      return boards;
    } catch (error) {
      console.error('Error fetching boards by season:', error);
      throw error;
    }
  }
}

export default SeasonUseCase;
