'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import { useLoginModal } from '@/hooks/useLoginModal';
import { Header, KakaoLoginModalContainer, MoreButton } from '@/app/components';
import WeatherIndex from './components/WeatherIndex';
import { useWeatherStore } from '@/stores/weatherState';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import TodayWeatherInfo from './components/TodayWeatherInfo';
import api from '@/utils/axiosInstance';
import HomeCarousel from './components/HomeCarousel';
import { Post } from '@/types/posts';
import TopPosts from './components/TopPosts';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();

  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();

  const [carouselSlides, setCarouselSlides] = useState<{ id: number; img: string }[]>([]);
  const [topPosts, setTopPosts] = useState<{ id: number; img: string }[]>([]);

  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  const handleLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const fetchCarouselData = useCallback(async () => {
    try {
      const res = await api.get(`/posts?sort=random&temp=${feels_like}`);
      if (res.data.success && res.data.data) {
        // id와 이미지를 묶어서 slides 배열 생성
        const slides = (res.data.data as Post[]).flatMap((post) =>
          post.photos.map((photo) => ({
            id: post.id,
            img: photo.img_url,
          })),
        );
        setCarouselSlides(slides);
      }
    } catch (error) {
      console.error('캐러셀 데이터 가져오기 실패:', error);
      setCarouselSlides([]);
    }
  }, [feels_like]);

  const fetchTopPosts = useCallback(async () => {
    try {
      const res = await api.get(`/posts?sort=likes&temp=${feels_like}`);
      if (res.data.success && res.data.data) {
        const topPosts = (res.data.data as Post[]).flatMap((post) =>
          post.photos.map((photo) => ({
            id: post.id,
            img: photo.img_url,
          })),
        );
        setTopPosts(topPosts);
      }
    } catch (error) {
      console.error('인기 게시글 가져오기 실패:', error);
      setTopPosts([]);
    }
  }, []);

  useEffect(() => {
    fetchCarouselData();
  }, [fetchCarouselData]);

  useEffect(() => {
    fetchTopPosts();
  }, [fetchTopPosts]);

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
      <div className="text-black text-[22px] font-semibold mb-[16px] mt-[6px] ml-4 mr-4">
        OOTD, 이건 어때요?
      </div>
      <HomeCarousel slides={carouselSlides} />
      <div className="text-black text-[22px] font-semibold mb-[16px] mt-[6px] ml-4 mr-4 whitespace-pre-line leading-[28px] mt-[24px]">
        {`${feels_like}℃, 오늘 뭐 입지? \n 인기 코디 모아보기`}
      </div>
      <TopPosts posts={topPosts} />
      <div className="mt-[32px] pb-[50px]">
        <MoreButton content="더 보러 가기" onClick={() => router.push('/ootd')} />
      </div>
    </>
  );
}
