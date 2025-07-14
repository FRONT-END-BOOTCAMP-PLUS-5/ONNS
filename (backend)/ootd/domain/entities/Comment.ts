interface Comment {
  id: number;
  text: string;
  parent_id?: number;
  user_id: number;
  post_id: number;
  date_created: string;
}

export default Comment;
