import Heart from '@/public/assets/icons/heart.svg';
import { useState } from 'react';
import PhotoGrid from './PhotoGrid';

const ToggleBar: React.FC = () => {
    const [mySelected, setMySelected] = useState(false);
    
    return (
        <>
        <div className="self-stretch inline-flex justify-between items-center">
            <div className={`w-[215px] h-[50px] shadow-[0px_0px_0px_0px_rgba(148,148,148,0.25)] border-b border-secondary-e200 inline-flex flex-col justify-center items-center ${mySelected ? 'border-b-2 border-secondary-e200' : 'border-b-2 border-[var(--b400)]'}`} onClick={() => setMySelected(false)}>
                <Heart className="w-[26px] h-[26px]" />
            </div>
            <div className={`w-[215px] h-[50px] relative border-b-2 ${mySelected ? 'border-[var(--b400)]' : 'border-b-2 border-secondary-e200'}`} onClick={() => setMySelected(true)}>
                <div className="w-[215px] h-[50px] flex items-center justify-center text-[var(--b400)] text-[18px] font-semibold font-['Pretendard']">MY</div>
            </div>
        </div>
            <PhotoGrid type={mySelected ? 'my' : 'liked'} />
        </>
    );
};

export default ToggleBar;