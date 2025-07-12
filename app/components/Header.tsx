'use client';
import Back from '@/public/assets/icons/back.svg';
import Close from '@/public/assets/icons/close.svg';
import Logo from '@/public/assets/icons/logo.svg';
import Notification from '@/public/assets/icons/notification-read.svg';
import NotificationUnread from '@/public/assets/icons/notification_unread.svg';
import { useRouter } from 'next/navigation';

type RightIconType =
  | { type: 'notification'; active: boolean; onClick: () => void }
  | { type: 'edit'; isEditing: boolean; onClick: () => void }
  | { type: 'close'; onClick: () => void };

interface HeaderProps {
  isGoBack?: boolean;
  rightIcons?: RightIconType[];
}

const Header = ({ isGoBack = false, rightIcons = [] }: HeaderProps) => {
  const router = useRouter();
  return (
    <div className="w-full pt-[16px] py-[16px] pl-[20px] pr-[20px] bg-white inline-flex justify-between items-center">
      <button className="w-[24px] h-[24px] flex items-center justify-center " onClick={router.back}>
        {isGoBack && <Back />}
      </button>
      <Logo width={390} height={29} />
      {rightIcons.map((icon, idx) => {
        if (icon.type === 'notification') {
          return (
            <button
              key={`notification-${idx}`}
              className="w-[24px] h-[24px] flex items-center justify-center"
              onClick={icon.onClick}
              aria-label="알림"
            >
              {icon.active ? <NotificationUnread /> : <Notification />}
            </button>
          );
        }
        if (icon.type === 'edit') {
          return (
            <button
              key={`edit-${idx}`}
              className="w-[24px] h-[24px] flex items-center justify-center text-[16px] whitespace-nowrap text-[color:var(--b400)] "
              onClick={icon.onClick}
              aria-label={icon.isEditing ? '수정' : '완료'}
            >
              {icon.isEditing ? '완료' : '수정'}
            </button>
          );
        }
        if (icon.type === 'close') {
          return (
            <button
              key={`close-${idx}`}
              className="w-[24px] h-[24px] flex items-center justify-center"
              onClick={router.back}
              aria-label="닫기"
            >
              <Close />
            </button>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Header;
