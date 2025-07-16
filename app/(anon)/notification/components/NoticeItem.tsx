'use client';
import { truncateText } from '@/lib/truncateText';
import Comment from '@/public/assets/icons/chat.svg';
import Likes from '@/public/assets/icons/heart.svg';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';

interface NoticeItemProps {
  id: number;
  type: string;
  user: string;
  timestamp: string;
  isRead: boolean;
  postId: number;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ type, user, timestamp, isRead, postId, id }) => {
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

  const handleClick = async () => {
    try {
      await api.patch(`/notifications/${id}/read`);
      router.push(`/ootd/${postId}`);
    } catch {
      alert('알림 읽음 처리에 실패했습니다. 다시 시도해 주세요.');
      router.replace('/notification');
    }
  };

  return (
    <>
      <div
        className={`self-stretch h-[80px] px-[20px] flex flex-col justify-center items-start gap-[8px] cursor-pointer active:opacity-80
    ${isRead ? 'bg-white' : 'bg-[#9CAFFC]/10'}`}
        onClick={handleClick}
      >
        <div className="flex justify-start items-center gap-[8px]">
          <div className="w-[45px] h-[45px] bg-white rounded-full outline outline-[var(--e100)] flex justify-center items-center gap-2.5">
            {getIcon()}
          </div>
          <div className="flex-1 flex flex-col justify-center gap-[4px]">
            <div className="px-[4px] flex items-center">
              <div className="text-center justify-start text-[16px] text-black">{getText()}</div>
            </div>
            <div className="self-stretch px-[4px] inline-flex justify-start items-center">
              <div className="text-center justify-start text-[#949494] text-[13px]">
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
