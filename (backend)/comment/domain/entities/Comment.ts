export default interface Comment {
  id: number;
  text: string;
  parent_id: number | null;
  user_id: number;
  post_id: number;
  date_created: string;
}
