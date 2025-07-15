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
    <html lang="en">
      <body className={`${pretendard.className} bg-white flex flex-col min-h-screen`}>
        <HeaderClient />
        <main className="flex-1 pb-24">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
