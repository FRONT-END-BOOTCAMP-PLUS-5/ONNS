'use client';
import Back from '@/public/assets/icons/back.svg';
import Close from '@/public/assets/icons/close.svg';
import Logo from '@/public/assets/icons/logo.svg';
import Notification from '@/public/assets/icons/notification-read.svg';
import NotificationUnread from '@/public/assets/icons/notification_unread.svg';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

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
  hasUnreadNotification,
}: HeaderProps) => {
  const router = useRouter();
  const { isJwtAuthenticated } = useAuthStore();

  const handleLeftClick = () => {
    if (isGoBack) {
      router.back();
    }
  };

  const handleRightClick = () => {
    if (isClose) {
      router.back();
    } else if (isHome) {
      if (hasUnreadNotification === undefined) return;
      if (isJwtAuthenticated) {
        router.push('/notification');
      } else {
        const url = new URL(window.location.href);
        url.searchParams.set('login', '1');
        window.location.href = url.toString();
      }
    }
  };

  return (
    <div className="w-full pt-[16px] py-[16px] pl-[20px] pr-[20px] bg-white inline-flex justify-between items-center fixed top-0 z-50 max-w-[430px] left-1/2 -translate-x-1/2">
      <button
        className="w-[24px] h-[24px] flex items-center justify-center "
        onClick={handleLeftClick}
      >
        {isGoBack && <Back />}
      </button>
      <Logo width={92} height={29} />
      <button
        className="w-[24px] h-[24px] flex items-center justify-center "
        onClick={handleRightClick}
      >
        {isClose && <Close />}
        {isHome &&
          hasUnreadNotification !== undefined &&
          (hasUnreadNotification ? <NotificationUnread /> : <Notification />)}
      </button>
    </div>
  );
};

export default Header;
