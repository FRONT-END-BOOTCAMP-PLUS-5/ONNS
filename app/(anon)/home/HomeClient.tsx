'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { Header, KakaoLoginModalContainer } from '@/app/components';
import WeatherIndex from './components/WeatherIndex';
import { useWeatherStore } from '@/stores/weatherState';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  // const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();
  const { umbrellaIndex, dustIndex } = useWeatherStore();
  // const shouldFetch = !!lat && !!lon && feels_like === null;
  // useWeather(shouldFetch ? lat : null, shouldFetch ? lon : null);

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
      <Header isHome={true} hasUnreadNotification={true} />
      <WeatherIndex umbrellaIndex={umbrellaIndex} dustIndex={dustIndex} />
    </>
  );
}
