export interface CommentWithUser {
  id: number;
  text: string;
  parent_id: number | null;
  user_id: number;
  post_id: number;
  date_created: string;
  user: {
    id: number;
    name: string;
    profile_img: string;
  };
  replies?: CommentWithUser[]; // 대댓글(답글) 리스트
  isMyComment?: boolean; // (옵션)
}

export interface RawCommentWithUser {
  id: number;
  text: string;
  parent_id: number | null;
  user_id: number;
  post_id: number;
  date_created: string;
  user: {
    id: number;
    name: string;
    profile_img: string;
  };
}
