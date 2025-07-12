'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { Header, KakaoLoginModalContainer } from '@/app/components';

export default function HomeClient() {
  const [isEditing, setIsEditing] = useState(false);
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
      <Header
        isGoBack={true} // 뒤로 가기
        // 오른쪽 아이콘 (알림,닫기,수정 중 사용하고 싶은 게 있으면)
        // rightIcons={[{ type: 'notification', active: true, onClick: () => {} }]} //알림
        // rightIcons={[{ type: 'close', onClick: () => {} }]} //닫기
        rightIcons={[
          {
            type: 'edit',
            isEditing,
            onClick: () => {
              setIsEditing(!isEditing);
            },
          },
        ]} //수정(위에 isEditing 상태 선언 필요)
      />
    </>
  );
}
