import ProfileEdit from '@/public/assets/icons/profile_edit.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProfilePicEditProps {
  onClick: () => void;
  profilePicture: string | null;
  isUploading?: boolean;
}

const ProfilePicEdit = ({ profilePicture, onClick, isUploading = false }: ProfilePicEditProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(profilePicture || null);

  useEffect(() => {
    if (!profilePicture || imageError) {
      setImageSrc(null);
    } else {
      setImageSrc(profilePicture);
    }
  }, [profilePicture, imageError]);

  return (
    <div className="relative">
      <div className="w-[121px] h-[121px]">
        {imageSrc ? (
          <Image
            fill
            className="rounded-full object-cover"
            src={imageSrc || ''}
            alt="profile picture"
            sizes="121px"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-[121px] h-[121px] bg-gray-200 rounded-full" />
        )}
      </div>
      <div className="w-[26px] h-[26px] absolute bottom-[3px] right-[6px] rounded-full shadow-[4px_4px_4px_0px_rgba(0,0,0,0.13)] cursor-pointer hover:bg-gray-50 transition-colors z-10 bg-white flex items-center justify-center">
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <ProfileEdit className="ml-[1.75px]" onClick={onClick} />
        )}
      </div>
    </div>
  );
};

export default ProfilePicEdit;
