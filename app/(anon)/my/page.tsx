'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axiosInstance';
import ToggleBar from './components/ToggleBar';
import ProfileEditHeader from './components/ProfileEditHeader';

//my
export default function My() {
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await api.get('users/me');

        if (res.data.ok && res.data.user) {
          setUserName(res.data.user.name);
          setProfilePicture(res.data.user.profile_img);
        } else {
          console.error('Error fetching profile image:', res.data.error);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    fetchProfileInfo();
  }, []);

  const handleProfileUpdate = (newProfilePicture: string | null) => {
    setProfilePicture(newProfilePicture);
  };

  return (
    <div className="w-full h-[100vh]">
      <ProfileEditHeader
        profilePicture={profilePicture}
        userName={userName}
        onProfileUpdate={handleProfileUpdate}
      />
      <ToggleBar />
      <span className="flex w-full h-[80px]"></span>
    </div>
  );
}
