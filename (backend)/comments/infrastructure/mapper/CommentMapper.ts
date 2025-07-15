import { RawCommentWithUser, CommentWithUser } from '../../application/dtos/CommentDto';

class CommentMapper {
  static toDomain(raw: RawCommentWithUser, myUserId: number): CommentWithUser {
    return {
      id: raw.id,
      text: raw.text,
      parent_id: raw.parent_id,
      user_id: raw.user_id,
      post_id: raw.post_id,
      date_created: raw.date_created,
      user: {
        id: raw.user?.id,
        name: raw.user?.name ?? '',
        profile_img: raw.user?.profile_img ?? '',
      },
      isMyComment: myUserId === raw.user_id,
    };
  }
}

export default CommentMapper;
