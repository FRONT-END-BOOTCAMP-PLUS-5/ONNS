import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from './components';
import HeaderClient from './components/HeaderClient';
import Logo from '@/public/assets/icons/icon_logo.svg';
const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
});

export const bmJua = localFont({
  src: '../public/fonts/BMJUA.ttf',
  display: 'swap',
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  title: '옷늘날씨',
  description: '기온별 옷차림 공유 커뮤니티',
  icons: {
    icon: '/assets/icons/icon_logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} flex justify-center min-h-screen overflow-x-hidden relative`}
      >
        <div className="hidden lg:flex items-center justify-center w-[calc((100vw-430px)/2)] fixed left-0 top-1/2 -translate-y-1/2 origin-left bg-[#EEEEF4]">
          <p
            className={`${bmJua.className} flex flex-col items-center text-center font-bold text-4xl text-[var(--b400)]`}
          >
            오늘은 뭐 입지? 고민 끝!
            <br /> <Logo height={150} width={150} className={'mt-[50px]'} />
          </p>
        </div>

        {/* 페이지 프레임 */}
        <div className="flex flex-col min-h-screen max-w-[430px] w-full mx-auto relative bg-white shadow-md z-10">
          <HeaderClient />
          <main className="flex-1 pb-24 w-full">{children}</main>
          <Nav />
        </div>
      </body>
    </html>
  );
}
