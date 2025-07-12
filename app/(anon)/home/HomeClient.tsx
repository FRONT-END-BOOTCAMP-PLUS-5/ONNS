'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { KakaoLoginModalContainer } from '@/app/components';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };
  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  return (
    <>
      {showLoginModal && (
        <KakaoLoginModalContainer onLogin={handleLogin} onClose={handleCloseModal} />
      )}
    </>
  );
}
