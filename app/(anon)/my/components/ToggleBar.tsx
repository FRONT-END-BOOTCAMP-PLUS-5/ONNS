import Heart from '@/public/assets/icons/heart.svg';
import PhotoGrid from './PhotoGrid';

interface ToggleBarProps {
  setIsToggleSetForMine: (isMine: boolean) => void;
  isToggleSetForMine: boolean;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ setIsToggleSetForMine, isToggleSetForMine }) => {
  return (
    <>
      <div className="w-full self-stretch inline-flex justify-between items-center">
        <div
          className={`flex-1 h-[50px] shadow-[0px_0px_0px_0px_rgba(148,148,148,0.25)] border-b border-secondary-e200 inline-flex flex-col justify-center items-center ${isToggleSetForMine ? 'border-b-2 border-secondary-e200' : 'border-b-2 border-[var(--b400)]'}`}
          onClick={() => {
            setIsToggleSetForMine(false);
          }}
        >
          <Heart className="w-[26px] h-[26px]" />
        </div>
        <div
          className={`flex-1 h-[50px] relative border-b-2 ${isToggleSetForMine ? 'border-[var(--b400)]' : 'border-b-2 border-secondary-e200'}`}
          onClick={() => {
            setIsToggleSetForMine(true);
          }}
        >
          <div className="w-full h-[50px] flex items-center justify-center text-[var(--b400)] text-[18px] font-semibold font-['Pretendard']">
            MY
          </div>
        </div>
      </div>
      <PhotoGrid type={isToggleSetForMine ? 'my' : 'liked'} />
    </>
  );
};

export default ToggleBar;
