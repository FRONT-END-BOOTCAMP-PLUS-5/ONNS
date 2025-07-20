'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axiosInstance';
import ToggleBar from './components/ToggleBar';
import ProfileEditHeader from './components/ProfileEditHeader';
import { useRouter } from 'next/navigation';
import { UnenrollModalContainer } from '@/app/components';

//my
export default function My() {
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleProfileUpdate = (newProfilePicture: string | null) => {
    setProfilePicture(newProfilePicture);
  };

  const handleDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다.', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/users/me');
      router.push('/');
    } catch (error) {
      console.error('회원탈퇴 중 오류가 발생했습니다.', error);
    }
  };

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

  return (
    <div className="w-full h-[100vh]">
      <ProfileEditHeader
        profilePicture={profilePicture}
        userName={userName}
        onProfileUpdate={handleProfileUpdate}
      />
      <ToggleBar />
      <div className="flex justify-center bg-white">
        <button
          onClick={handleLogout}
          className="text-[#6A71E5] text-[15px] font-normal underline cursor-pointer"
        >
          로그아웃
        </button>
      </div>
      <div className="flex justify-center bg-white pt-4">
        <button
          onClick={handleDeleteModal}
          className="text-[#6A71E5] text-[15px] font-normal underline cursor-pointer"
        >
          회원탈퇴
        </button>
      </div>
      <span className="flex w-full h-[200px] bg-white"></span>
      {isDeleteModalOpen && (
        <UnenrollModalContainer
          onUnenroll={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
