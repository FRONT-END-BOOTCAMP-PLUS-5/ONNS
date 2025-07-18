'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { Header, KakaoLoginModalContainer } from '@/app/components';
import WeatherIndex from './components/WeatherIndex';
import { useWeatherStore } from '@/stores/weatherState';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import TodayWeatherInfo from './components/TodayWeatherInfo';
import api from '@/utils/axiosInstance';
import { useAuthStore } from '@/stores/authStore';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();

  const { isJwtAuthenticated, hasUnreadNotification, checkJwt, setHasUnreadNotification } =
    useAuthStore();

  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();

  useEffect(() => {
    checkJwt();
  }, [checkJwt]);

  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  const handleCloseModalAndRemoveLoginParam = () => {
    handleCloseModal();
    const params = new URLSearchParams(window.location.search);
    params.delete('login');
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  useEffect(() => {
    console.log('useEffect 실행', isJwtAuthenticated);
    if (!isJwtAuthenticated) {
      setHasUnreadNotification(undefined);
      return;
    }
    const fetchUnreadNotifications = async () => {
      try {
        const response = await api.get('/notifications?hasUnread=true');
        setHasUnreadNotification(response.data.hasUnread);
      } catch {
        setHasUnreadNotification(undefined); // 호출 실패 시 아이콘 숨김
      }
    };
    fetchUnreadNotifications();
  }, [isJwtAuthenticated, setHasUnreadNotification]);

  console.log(
    'isJwtAuthenticated:',
    isJwtAuthenticated,
    'hasUnreadNotification:',
    hasUnreadNotification,
  );

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <>
      {showLoginModal && (
        <KakaoLoginModalContainer
          onLogin={handleLogin}
          onClose={handleCloseModalAndRemoveLoginParam}
        />
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
