'use client';
import { truncateText } from '@/lib/truncateText';
import Comment from '@/public/assets/icons/chat.svg';
import Likes from '@/public/assets/icons/heart.svg';
import { useRouter } from 'next/navigation';

interface NoticeItemProps {
  type: string;
  user: string;
  timestamp: string;
  isRead: boolean;
  postId: number;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ type, user, timestamp, isRead, postId }) => {
  const router = useRouter();
  const getText = () => {
    const truncatedUser = truncateText(user, 4);
    switch (type) {
      case 'comment':
        return `${truncatedUser}님이 당신의 게시글에 댓글을 남겼어요.`;
      case 'reply':
        return `${truncatedUser}님이 당신의 댓글의 대댓글을 남겼어요.`;
      case 'like':
        return `${truncatedUser}님이 당신의 게시글에 좋아요를 남겼어요.`;
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'comment':
      case 'reply':
        return <Comment width={20} height={20} fill="#6A71E5" />;
      case 'like':
        return <Likes width={20} height={20} fill="#FFFFFF" stroke="#6A71E5" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    router.push(`/ootd/${postId}`);
  };

  const backgroundColor = isRead ? 'bg-white' : 'bg-[#9CAFFC]/10';

  return (
    <>
      <div
        className={`self-stretch h-20 px-5 py-3 inline-flex flex-col justify-center items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity ${backgroundColor}`}
        onClick={handleClick}
      >
        <div className="self-stretch inline-flex justify-start items-center gap-2">
          <div className="w-11 h-11 bg-white rounded-full outline outline-[var(--e100)] flex justify-center items-center gap-2.5">
            {getIcon()}
          </div>
          <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
            <div className="px-1 inline-flex justify-center items-center gap-2.5">
              <div className="text-center justify-start text-[16px] text-black">{getText()}</div>
            </div>
            <div className="self-stretch px-1 inline-flex justify-start items-center gap-2.5">
              <div className="text-center justify-start text-[#949494] text-xs font-normal">
                {timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeItem;
