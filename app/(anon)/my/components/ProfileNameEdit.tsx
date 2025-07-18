import EditPencil from '@/public/assets/icons/edit_pencil.svg';
import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/axiosInstance';

const ProfileNameEdit = ({ userName }: { userName: string | null }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [tempUserName, setTempUserName] = useState<string>(''); // For canceling changes

  // Update newUserName when userName prop changes
  useEffect(() => {
    if (userName) {
      setNewUserName(userName);
      setTempUserName(userName);
    }
  }, [userName]);

  const handleCancel = useCallback(() => {
    setNewUserName(tempUserName); // Restore original value
    setIsEditing(false);
  }, [tempUserName]);

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isEditing && !target.closest('.profile-name-edit')) {
        handleCancel();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, handleCancel]);

  const handleNameEditClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsEditing(true);
    setTempUserName(newUserName); // Save current value for potential cancel
    e.stopPropagation();
  };

  const handleSave = async () => {
    const res = await api.patch('/users/me', {
      name: newUserName,
    });
    if (res.data.ok) {
      setNewUserName(res.data.user.name);
      setTempUserName(res.data.user.name);
      setIsEditing(false);
    } else {
      console.error('Error editing name:', res.data.error);
    }
  };

  // Show loading state while userName is null
  if (!userName) {
    return (
      <div className="inline-flex justify-start items-center gap-1 relative">
        <div className="text-center justify-start text-gray-400 text-base font-medium font-['Pretendard']">
          <span>&nbsp;</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex justify-start items-center gap-1 relative profile-name-edit">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="border-transparent focus:border-white focus:outline-none rounded px-2 py-1 text-base text-black font-medium font-['Pretendard'] w-auto min-w-0"
            style={{
              width: `${Math.max(newUserName.length, 6)}ch`,
              minWidth: '4ch',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          <span
            className="text-black text-base font-medium font-['Pretendard'] cursor-pointer ml-2"
            onClick={handleSave}
          >
            확인
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="text-center justify-start text-black text-base font-medium font-['Pretendard']">
            {newUserName}
          </div>
          <EditPencil
            className="w-[9.1px] h-[9.1px] bg-transparent rounded-full cursor-pointer transition-colors"
            onClick={handleNameEditClick}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileNameEdit;
