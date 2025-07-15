'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import OOTD from '@/public/assets/icons/ootd.svg';
import HOME from '@/public/assets/icons/home.svg';
import MY from '@/public/assets/icons/my.svg';

interface NavProps {
  className?: string;
}

function shouldHideNav(pathname?: string) {
  if (!pathname) return false;
  if (['/ootd/write', '/notification'].includes(pathname)) return true;
  if (/^\/ootd\/[^/]+$/.test(pathname)) return true; // /ootd/[id]
  return false;
}

const Nav: React.FC<NavProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const router = useRouter();

  if (shouldHideNav(pathname)) return null;

  const isOOTDActive = pathname === '/ootd';
  const isMyActive = pathname === '/my';
  const isHomeActive = pathname === '/' || (!isOOTDActive && !isMyActive);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 flex flex-col justify-center w-[430px] mx-auto h-[100px] bg-white shadow-[0px_-8px_16px_0px_rgba(34,34,34,0.10)] z-50 ${className}`}
    >
      <div className="flex justify-center gap-x-[80px] items-center h-full mt-[24px] mb-[21.26px]">
        <button
          onClick={() => router.push('/ootd')}
          className="flex flex-col justify-center items-center w-[53px]"
        >
          <OOTD width={36} height={31} className="" fill={isOOTDActive ? '#6A71E5' : 'white'} />
          <span className="text-[12px] mt-[6px] h-[16px] font-semibold text-[#202020]">OOTD</span>
        </button>

        <button
          onClick={() => router.push('/')}
          className="flex flex-col justify-center items-center w-[47px]"
        >
          <HOME width={36} height={31} fill={isHomeActive ? '#6A71E5' : 'white'} />
          <span className="text-[12px] mt-[6px] h-[16px] font-semibold text-[#202020]">HOME</span>
        </button>

        <button
          onClick={() => router.push('/my')}
          className="flex flex-col justify-center items-center w-[53px]"
        >
          <MY width={36} height={31} fill={isMyActive ? '#6A71E5' : 'white'} />
          <span className="text-[12px] mt-[6px] h-[16px] font-semibold text-[#202020]">MY</span>
        </button>
      </div>
    </div>
  );
};

export default Nav;
