import { RawBoardWithUser, BoardWithUser } from '../../application/dtos/BoardDto';

class BoardMapper {
  static toDomain(raw: RawBoardWithUser, myUserId: number): BoardWithUser {
    return {
      id: raw.id,
      text: raw.text,
      feels_like: raw.feels_like,
      date_created: raw.date_created,
      user_id: raw.user_id,
      photos: raw.photos,
      user: raw.user,
      isMyPost: myUserId === raw.user_id,
    };
  }
}

export default BoardMapper;
