'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const HeaderClient = () => {
  const pathname = usePathname();

  // 홈에서는 Header 아예 렌더링 X
  if (pathname === '/') return null;
  let headerProps = {};

  if (pathname === '/ootd/write') {
    headerProps = { isClose: true };
  } else if (/^\/ootd\/\d+$/.test(pathname)) {
    headerProps = { isGoBack: true };
  }
  return <Header {...headerProps} />;
};

export default HeaderClient;
