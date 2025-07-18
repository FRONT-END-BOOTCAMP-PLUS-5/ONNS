'use client';

import ProfilePicEdit from './ProfilePicEdit';
import ProfileNameEdit from './ProfileNameEdit';
import { useProfilePictureUpload } from '@/hooks/useProfilePictureUpload';

interface ProfileEditHeaderProps {
  profilePicture: string | null;
  userName: string | null;
  onProfileUpdate?: (newProfilePicture: string | null) => void;
}

const ProfileEditHeader = ({
  profilePicture,
  userName,
  onProfileUpdate,
}: ProfileEditHeaderProps) => {
  const { isUploading, error, uploadProfilePicture, fileInputRef, openFileDialog } =
    useProfilePictureUpload();

  const handleEditClick = () => {
    openFileDialog();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadProfilePicture(file);
    if (result.success && result.user) {
      // Update the profile picture state with the actual URL
      onProfileUpdate?.(result.user.profile_img);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full h-[210px] box-border bg-white flex flex-col justify-center items-center gap-[9px] pt-[30.5px] pb-[30.5px]">
      <ProfilePicEdit
        profilePicture={profilePicture}
        onClick={handleEditClick}
        isUploading={isUploading}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <ProfileNameEdit userName={userName} />
    </div>
  );
};

export default ProfileEditHeader;
