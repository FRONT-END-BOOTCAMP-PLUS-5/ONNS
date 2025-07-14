'use client';

import ProfilePicEdit from './ProfilePicEdit';
import ProfileNameEdit from './ProfileNameEdit';

interface ProfileEditHeaderProps {
  profilePicture: string | null;
  userName: string | null;
}

const ProfileEditHeader = ({ profilePicture, userName }: ProfileEditHeaderProps) => {
  const handleEditClick = () => {
    console.log('edit');
    // Add your edit logic here
  };

  return profilePicture ? (
    <div className="w-full h-[210px] box-border bg-white flex flex-col justify-center items-center gap-[9px] pt-[30.5px] pb-[30.5px]">
      <ProfilePicEdit profilePicture={profilePicture} onClick={handleEditClick} />
      <ProfileNameEdit userName={userName} />
    </div>
  ) : (
    <div className="w-full h-[210px] box-border bg-white flex flex-col justify-center items-center gap-[9px] pt-[30.5px] pb-[30.5px]" />
  );
};

export default ProfileEditHeader;
