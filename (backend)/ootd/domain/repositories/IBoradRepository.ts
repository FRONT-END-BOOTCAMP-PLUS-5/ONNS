import Board from '../entities/Board';

interface IBoardRepository {
  getById(id: string): Promise<Board | null>;
  create(board: Omit<Board, 'id' | 'date_created'>, img_url?: string[]): Promise<Board>;
  update(id: string, updateData: Partial<Board>, userId: number): Promise<void>;
  delete(id: string, userId: number): Promise<void>;
  getBySeason(season: string, sort?: string, min?: number, max?: number): Promise<Board[]>;
  getCurrentSeasonPosts(sort?: string): Promise<Board[]>;
}

export default IBoardRepository;
