import React from 'react';
import { useRouter } from 'next/navigation';
import EditPencil from '@/public/assets/icons/edit_pencil.svg';

const Postfloating = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/ootd/write');
  };

  return (
    <div className="fixed bottom-28 right-4 z-50 sm:right-1/2 sm:translate-x-1/2 sm:left-auto md:right-[calc(50vw-195px)] md:translate-x-0">
      <button
        onClick={handleClick}
        className="w-16 h-16 relative cursor-pointer"
        style={{ padding: 0, border: 'none', background: 'none' }}
      >
        <div className="absolute inset-0 bg-zinc-100/80 rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
        <div className="absolute inset-0 flex justify-center items-center">
          <EditPencil className="w-[24px] h-[24px] text-[#6A71E5]" />
        </div>
      </button>
    </div>
  );
};

export default Postfloating;
