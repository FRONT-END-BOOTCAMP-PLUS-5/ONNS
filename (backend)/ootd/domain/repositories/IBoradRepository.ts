import Board from '../entities/Board';

interface IBoardRepository {
  getById(id: string, myUserId: number): Promise<Board | null>;
  create(
    board: Omit<
      Board,
      | 'id'
      | 'date_created'
      | 'comment_count'
      | 'like_count'
      | 'photos'
      | 'user'
      | 'comments'
      | 'likes'
    >,
    img_url?: string[],
  ): Promise<Board>;
  update(id: string, updateData: Partial<Board>, userId: number): Promise<void>;
  delete(id: string, userId: number): Promise<void>;
  getBySeason(season: string, sort?: string, min?: number, max?: number): Promise<Board[]>;
  getCurrentSeasonPosts(sort?: string, offset?: number, limit?: number): Promise<Board[]>;
  getRandomPosts(limit: number): Promise<Board[]>;
  getMostLikedPosts(limit: number): Promise<Board[]>;
  getMostLikedPostsByTemp(currentTemp: number, tempRange: number, limit: number): Promise<Board[]>;
}

export default IBoardRepository;
