import Board from '../entities/Board';

interface IBoardRepository {
  getById(id: string): Promise<Board | null>;
  create(board: Omit<Board, 'id' | 'date_created'>, img_url?: string[]): Promise<Board>;
  update(id: string, updateData: Partial<Board>, userId: number): Promise<void>;
  delete(id: string, userId: number): Promise<void>;
  getBySeason(season: string): Promise<Board[]>;
  getCurrentSeasonPosts(): Promise<Board[]>;
  getRandomPosts(limit: number): Promise<Board[]>;
  getMostLikedPosts(limit: number): Promise<Board[]>;
}

export default IBoardRepository;
