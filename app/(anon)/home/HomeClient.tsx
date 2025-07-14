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
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();

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
      <TodayWeatherInfo cityname={cityName} feels_like={feels_like} />
      <div className="mt=[4px] text-neutral-800/40 text-xs font-light ml-4 mr-4 text-right">
        **체감온도 기준
      </div>
    </>
  );
}
