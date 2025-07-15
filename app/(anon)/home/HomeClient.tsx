'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { Header, KakaoLoginModalContainer } from '@/app/components';
import WeatherIndex from './components/WeatherIndex';
import { useWeatherStore } from '@/stores/weatherState';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import TodayWeatherInfo from './components/TodayWeatherInfo';
import api from '@/utils/axiosInstance';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();
  const [hasUnreadNotification, setHasUnreadNotification] = useState<boolean | undefined>(
    undefined,
  );

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();

  // JWT 토큰이 쿠키에 있으면 인증된 것으로 간주
  const isJwtAuthenticated =
    typeof window !== 'undefined' && !!document.cookie.match(/(^| )token=([^;]+)/);

  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  useEffect(() => {
    if (!isJwtAuthenticated) {
      setHasUnreadNotification(undefined);
      console.log('JWT 없음: hasUnreadNotification 초기화(undefined)');
      return;
    }
    const fetchUnreadNotifications = async () => {
      try {
        const response = await api.get('/notification/unread');
        setHasUnreadNotification(response.data.hasUnread);
        console.log('알림 fetch:', response.data.hasUnread);
      } catch {
        setHasUnreadNotification(undefined); // 호출 실패 시 아이콘 숨김
        console.log('알림 fetch 실패: undefined');
      }
    };
    fetchUnreadNotifications();
  }, [isJwtAuthenticated]);
  console.log(
    'isJwtAuthenticated:',
    isJwtAuthenticated,
    'hasUnreadNotification:',
    hasUnreadNotification,
  );

  return (
    <>
      {showLoginModal && (
        <KakaoLoginModalContainer onLogin={handleLogin} onClose={handleCloseModal} />
      )}
      <Header
        isHome={true}
        hasUnreadNotification={isJwtAuthenticated ? hasUnreadNotification : undefined}
      />
      <WeatherIndex umbrellaIndex={umbrellaIndex} dustIndex={dustIndex} />
      <TodayWeatherInfo cityname={cityName} feels_like={feels_like} />
      <div className="mt=[4px] text-neutral-800/40 text-xs font-light ml-4 mr-4 text-right">
        **체감온도 기준
      </div>
    </>
  );
}
