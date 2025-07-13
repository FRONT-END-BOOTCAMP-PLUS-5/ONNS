export interface BoardWithUser {
  id: number;
  text: string;
  feels_like: number;
  date_created: string;
  user_id: number;
  photos?: { img_url: string }[];
  user?: {
    id: number;
    name: string;
    profile_img: string;
  };
  isMyPost: boolean;
}

export interface RawBoardWithUser {
  id: number;
  text: string;
  feels_like: number;
  date_created: string;
  user_id: number;
  photos?: { img_url: string }[];
  user?: {
    id: number;
    name: string;
    profile_img: string;
  };
}
