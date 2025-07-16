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

export default function HomeClient() {
  const searchParams = useSearchParams();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();

  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();

  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleRandomPostsByTemp = async () => {
    if (feels_like) {
      const res = await api.get(`/posts?sort=random&temp=${feels_like}`);
      console.log(res.data);
    }
  };

  const handleMostLikedPostsByTemp = async () => {
    if (feels_like) {
      const res = await api.get(`/posts?sort=likes&temp=${feels_like}`);
      console.log(res.data);
    }
  };

  useEffect(() => {
    handleRandomPostsByTemp();
    handleMostLikedPostsByTemp();
  }, [feels_like]);

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
