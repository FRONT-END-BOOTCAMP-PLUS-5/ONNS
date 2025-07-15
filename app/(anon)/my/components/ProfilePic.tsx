import Image from 'next/image';
import { useState } from 'react';

interface ProfilePicProps {
  profilePicture: string | null;
}

const ProfilePic = ({ profilePicture }: ProfilePicProps) => {
  const [imageError, setImageError] = useState(false);

  // Default avatar image (using existing test profile image)
  const defaultAvatar =
    'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg';

  // Use default avatar if no profile picture or if image failed to load
  const imageSrc = !profilePicture || imageError ? defaultAvatar : profilePicture;

  return (
    <div className="relative w-[121px] h-[121px]">
      <Image
        fill
        className="rounded-full object-cover"
        src={imageSrc}
        alt="profile picture"
        sizes="121px"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ProfilePic;
