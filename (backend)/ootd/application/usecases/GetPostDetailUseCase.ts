import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import Board from '../../domain/entities/Board';

class GetPostDetailUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  // 게시글 상세 조회
  async getPostById(id: string): Promise<Board | null> {
    try {
      const post = await this.boardRepository.getById(id);
      return post;
    } catch (error) {
      console.error('Error fetching post detail:', error);
      throw error;
    }
  }
}

export default GetPostDetailUseCase;
