import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import Board from '../../domain/entities/Board';

class UpdateUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute(id: string, updateData: Partial<Board>, userId: number): Promise<void> {
    try {
      // text 필드만 수정
      await this.boardRepository.update(id, { text: updateData.text }, userId);
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  }
}

export default UpdateUseCase;
