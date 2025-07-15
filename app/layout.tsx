import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Nav } from './components';
import HeaderClient from './components/HeaderClient';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
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
    <html lang="en" className="">
      <body
        className={`${pretendard.className} flex flex-col items-center h-screen overflow-x-hidden relative`}
        style={{ backgroundColor: '#BFBFBF' }} // Tailwind's gray-50 hex value
      >
        <HeaderClient />
        <main className="flex-1 bg-white w-[430px]">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
