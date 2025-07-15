import ProfileEdit from '@/public/assets/icons/profile_edit.svg';
import Image from 'next/image';

interface ProfilePicEditProps {
  onClick: () => void;
  profilePicture: string | null;
}

const ProfilePicEdit = ({ profilePicture, onClick }: ProfilePicEditProps) => {
  return (
    <div className="relative">
      <div className="w-[121px] h-[121px]">
        <Image
          fill
          className="rounded-full object-cover"
          src={profilePicture || ''}
          alt="profile picture"
          sizes="121px"
          priority
        />
      </div>
      <div className="w-[26px] h-[26px] absolute bottom-[3px] right-[6px] rounded-full shadow-[4px_4px_4px_0px_rgba(0,0,0,0.13)] cursor-pointer hover:bg-gray-50 transition-colors z-10 bg-white flex items-center justify-center">
        <ProfileEdit className="ml-[1.75px]" onClick={onClick} />
      </div>
    </div>
  );
};

export default ProfilePicEdit;
