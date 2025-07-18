export interface Photo {
  img_url: string;
}

export interface Post {
  id: number;
  text: string;
  feels_like: number;
  date_created: string;
  user_id: number;
  comment_count: number;
  like_count: number;
  isMyPost: boolean;
  photos: Photo[];
  user: {
    id: number;
    name: string;
    profile_img: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta: {
    sort: string;
    limit: number;
    order: string;
    season: string;
    temp: number | null;
    total: number;
  };
}

// 특정 API 응답 타입들
export type PostsApiResponse = ApiResponse<Post[]>;
export type PostApiResponse = ApiResponse<Post>;
