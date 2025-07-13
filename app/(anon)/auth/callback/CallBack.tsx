'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { KakaoTalkLoginBtn, Modal } from '@/app/components';
import axios from 'axios';

export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();

  const kakaoLogin = async (code: string) => {
    const response = await axios.post('/api/auth/kakao', { code });
    return response.data;
  };

  useEffect(() => {
    const login = async () => {
      if (!code) {
        return;
      }
      try {
        await kakaoLogin(code);
        router.push('/');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
        alert(errorMessage);
        router.push('/');
      }
    };

    login();
  }, [code, router]);

  return (
    <Modal text="로그인 중 ..." btn={<KakaoTalkLoginBtn onClick={() => {}} />} onClose={() => {}} />
  );
}
