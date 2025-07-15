export interface User {
  id: number;
  name: string;
  profile_img: string;
  date_created: string;
}

export interface UserLike {
  post_id: number;
  user_id: number;
}

export interface UserPost {
  id: number;
  user_id: number;
  // Add other post fields as needed
}
