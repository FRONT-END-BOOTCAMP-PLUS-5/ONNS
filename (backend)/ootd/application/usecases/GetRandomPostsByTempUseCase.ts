import SbBoardRepository from '../../infrastructure/repositories/SbBoardRepositories';
import { BoardWithUser } from '../dtos/BoardDto';
import BoardMapper from '../../infrastructure/mapper/BoardMapper';

interface GetRandomPostsByTempUseCaseProps {
  myUserId?: number;
  currentTemp: number;
  tempRange: number;
  limit: number;
}

class GetRandomPostsByTempUseCase {
  private boardRepository: SbBoardRepository;

  constructor(boardRepository: SbBoardRepository) {
    this.boardRepository = boardRepository;
  }

  async execute({
    myUserId,
    currentTemp,
    tempRange,
    limit,
  }: GetRandomPostsByTempUseCaseProps): Promise<BoardWithUser[]> {
    try {
      // Get posts within temperature range
      const posts = await this.boardRepository.getMostLikedPostsByTemp(currentTemp, tempRange, 50); // Get more posts to randomize from

      // Shuffle the posts to get random selection
      const shuffledPosts = this.shuffleArray([...posts]);

      // Take the first 'limit' posts
      const randomPosts = shuffledPosts.slice(0, limit);

      return randomPosts.map((board) => BoardMapper.toDomain(board, myUserId));
    } catch (error) {
      console.error('Error fetching random posts by temperature:', error);
      throw error;
    }
  }

  // Fisher-Yates shuffle algorithm
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default GetRandomPostsByTempUseCase;
