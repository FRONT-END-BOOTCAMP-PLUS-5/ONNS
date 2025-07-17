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
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col h-[100px] bg-white shadow-[0px_-8px_16px_0px_rgba(34,34,34,0.10)] z-50 max-w-[430px] w-full mx-auto ${className}`}
    >
      <div className="flex justify-around items-center h-full mt-[24px] mb-[21.26px]">
        <button
          onClick={() => router.push('/ootd')}
          className="flex flex-col justify-center items-center text-sm w-[53px] h-[48px]"
        >
          <OOTD width={28} height={24} fill={isOOTDActive ? '#6A71E5' : 'white'} />
          <span className="text-[16px] font-medium leading-normal text-[#202020]">OOTD</span>
        </button>

        <button
          onClick={() => router.push('/')}
          className="flex flex-col justify-center items-center text-sm w-[47px] h-[48px]"
        >
          <HOME width={23} height={25} fill={isHomeActive ? '#6A71E5' : 'white'} />
          <span className="text-[16px] font-medium leading-normal text-[#202020]">HOME</span>
        </button>

        <button
          onClick={() => router.push('/my')}
          className="flex flex-col justify-center items-center text-sm w-[53px] h-[48px]"
        >
          <MY width={20} height={24} fill={isMyActive ? '#6A71E5' : 'white'} />
          <span className="text-[16px] font-medium leading-normal text-[#202020]">MY</span>
        </button>
      </div>
    </div>
  );
};

export default Nav;
