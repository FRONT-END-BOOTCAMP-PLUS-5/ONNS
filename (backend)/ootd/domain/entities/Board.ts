import User from './User';
import Comment from './Comment';
import Like from './Like';

interface Board {
  id: number;
  text: string;
  feels_like: number;
  date_created: string;
  user_id: number;
  photos?: { img_url: string }[];
  user?: User;
  comments?: Comment[];
  likes?: Like[];
  comment_count?: number;
  like_count?: number;
}

export default Board;
