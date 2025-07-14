'use client';
import Back from '@/public/assets/icons/back.svg';
import Close from '@/public/assets/icons/close.svg';
import Logo from '@/public/assets/icons/logo.svg';
import Notification from '@/public/assets/icons/notification-read.svg';
import NotificationUnread from '@/public/assets/icons/notification_unread.svg';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isGoBack?: boolean;
  isClose?: boolean;
  isHome?: boolean;
  hasUnreadNotification?: boolean;
}

const Header = ({
  isGoBack = false,
  isClose = false,
  isHome = false,
  hasUnreadNotification = false,
}: HeaderProps) => {
  const router = useRouter();
  return (
    <div className="w-full pt-[16px] py-[16px] pl-[20px] pr-[20px] bg-white inline-flex justify-between items-center">
      <button className="w-[24px] h-[24px] flex items-center justify-center " onClick={router.back}>
        {isGoBack && <Back />}
      </button>
      <Logo width={92} height={29} />
      <button className="w-[24px] h-[24px] flex items-center justify-center " onClick={router.back}>
        {isClose && <Close />}
        {isHome && (hasUnreadNotification ? <NotificationUnread /> : <Notification />)}
      </button>
    </div>
  );
};

export default Header;
