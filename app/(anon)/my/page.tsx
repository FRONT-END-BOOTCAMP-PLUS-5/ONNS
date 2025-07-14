'use client';

import ProfileHeader from './components/ProfileHeader';
import ToggleBar from './components/ToggleBar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileEditHeader from './components/ProfileEditHeader';
import { useEditStore } from '@/stores/editState';

//my
export default function My() {
  const { isEdit } = useEditStore();
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const res = await axios.get('/api/my/me');

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

  return (
    <div className="w-[430px] h-[100vh]">
      {isEdit ? (
        <ProfileEditHeader profilePicture={profilePicture} userName={userName} />
      ) : (
        <ProfileHeader profilePicture={profilePicture} userName={userName} />
      )}
      <ToggleBar />
    </div>
  );
}
