import { User } from '../entities/User';

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
}

export interface PostWithPhotos {
  id: number;
  date_created: string;
  photos: {
    id: number;
    img_url: string;
  }[];
}

export interface IUserRepository {
  getUserById(id: number): Promise<User | null>;
  updateUser(id: number, data: Partial<User>): Promise<User | null>;
  getUserLikes(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>>;
  getUserPosts(
    userId: number,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<PostWithPhotos>>;
  uploadProfileImage(
    userId: number,
    file: File,
  ): Promise<{ success: boolean; url?: string; error?: string }>;
  deleteProfileImage(userId: number, imageUrl: string): Promise<boolean>;
}
