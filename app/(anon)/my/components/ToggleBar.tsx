import Heart from '@/public/assets/icons/heart.svg';
import { useState } from 'react';
import PhotoGrid from './PhotoGrid';

const ToggleBar: React.FC = () => {
  const [mySelected, setMySelected] = useState(false);

  return (
    <>
      <div className="w-full self-stretch inline-flex justify-between items-center">
        <div
          className={`flex-1 h-[50px] shadow-[0px_0px_0px_0px_rgba(148,148,148,0.25)] border-b-2 inline-flex flex-col justify-center items-center ${mySelected ? 'border-none' : 'border-[var(--b400)]'}`}
          onClick={() => setMySelected(false)}
        >
          <Heart className="w-[26px] h-[26px]" />
        </div>
        <div
          className={`flex-1 h-[50px] relative border-b-2 ${mySelected ? 'border-[var(--b400)]' : 'border-none'}`}
          onClick={() => setMySelected(true)}
        >
          <div className="w-full h-[50px] flex items-center justify-center text-[var(--b400)] text-[18px] font-semibold font-['Pretendard']">
            MY
          </div>
        </div>
      </div>
      <PhotoGrid type={mySelected ? 'my' : 'liked'} />
    </>
  );
};

export default ToggleBar;
