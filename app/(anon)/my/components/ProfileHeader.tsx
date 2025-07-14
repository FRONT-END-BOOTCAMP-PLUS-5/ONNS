'use client';

import ProfilePic from './ProfilePic';
import ProfileName from './ProfileName';

interface ProfileHeaderProps {
  profilePicture: string | null;
  userName: string | null;
}

const ProfileHeader = ({ profilePicture, userName }: ProfileHeaderProps) => {
  return profilePicture ? (
    <div className="w-full h-[210px] box-border bg-white flex flex-col justify-center items-center gap-[9px] pt-[30.5px] pb-[30.5px]">
      <ProfilePic profilePicture={profilePicture} />
      <ProfileName userName={userName} />
    </div>
  ) : (
    <div className="w-full h-[210px] box-border bg-white flex flex-col justify-center items-center gap-[9px] pt-[30.5px] pb-[30.5px]" />
  );
};

export default ProfileHeader;
