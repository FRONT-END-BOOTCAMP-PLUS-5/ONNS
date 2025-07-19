'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import api from '@/utils/axiosInstance';

import { Header, KakaoLoginModalContainer, MoreButton } from '@/app/components';
import WeatherIndex from './components/WeatherIndex';
import TodayWeatherInfo from './components/TodayWeatherInfo';
import HomeCarousel from './components/HomeCarousel';
import TopPosts from './components/TopPosts';

import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { useLoginModal } from '@/hooks/useLoginModal';

import { useAuthStore } from '@/stores/authStore';
import { useWeatherStore } from '@/stores/weatherState';

import { Post } from '@/types/posts';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lat, lon } = useLocation();
  useWeather(lat, lon);
  const { cityName, feels_like, umbrellaIndex, dustIndex } = useWeatherStore();
  const [carouselSlides, setCarouselSlides] = useState<{ id: number; img: string }[]>([]);
  const [topPosts, setTopPosts] = useState<{ id: number; img: string }[]>([]);
  const { showLoginModal, handleOpenModal, isAuthenticated, loading, handleCloseModal } =
    useLoginModal();
  const { isJwtAuthenticated, hasUnreadNotification, checkJwt, setHasUnreadNotification } =
    useAuthStore();

  // 게시글
  const fetchCarouselSlides = useCallback(async () => {
    try {
      const res = await api.get(`/posts?sort=random&temp=${feels_like}`);
      if (res.data.success && res.data.data) {
        const slides = (res.data.data as Post[]).flatMap((post) =>
          post.photos.map((photo) => ({ id: post.id, img: photo.img_url })),
        );
        setCarouselSlides(slides);
      }
    } catch {
      setCarouselSlides([]);
    }
  }, [feels_like]);

  const fetchTopPosts = useCallback(async () => {
    try {
      const res = await api.get(`/posts?sort=likes&temp=${feels_like}`);
      if (res.data.success && res.data.data) {
        const topPosts = (res.data.data as Post[]).flatMap((post) =>
          post.photos.map((photo) => ({ id: post.id, img: photo.img_url })),
        );
        setTopPosts(topPosts);
      }
    } catch {
      setTopPosts([]);
    }
  }, [feels_like]);

  //로그인 상태 체크
  useEffect(() => {
    checkJwt();
  }, [checkJwt]);

  //로그인 모달 오픈
  useEffect(() => {
    if (searchParams.get('login') === '1' && !isAuthenticated && !loading) {
      handleOpenModal();
    }
  }, [searchParams, isAuthenticated, loading, handleOpenModal]);

  //알림 상태 fetch
  useEffect(() => {
    if (!isJwtAuthenticated) {
      setHasUnreadNotification(undefined);
      return;
    }
    const fetchUnreadNotifications = async () => {
      try {
        const response = await api.get('/notifications?hasUnread=true');
        setHasUnreadNotification(response.data.hasUnread);
      } catch {
        setHasUnreadNotification(undefined);
      }
    };
    fetchUnreadNotifications();
  }, [isJwtAuthenticated, setHasUnreadNotification]);

  //게시글 fetch
  useEffect(() => {
    const loadData = async () => {
      await fetchCarouselSlides();
      await fetchTopPosts();
    };
    loadData();
  }, [fetchCarouselSlides, fetchTopPosts]);

  //핸들러
  const handleCloseModalAndRemoveLoginParam = () => {
    handleCloseModal();
    const params = new URLSearchParams(window.location.search);
    params.delete('login');
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

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
      <div className="text-black text-[22px] font-semibold mb-[16px] mt-[6px] ml-4 mr-4">
        OOTD, 이건 어때요?
      </div>
      <HomeCarousel slides={carouselSlides} />
      <div className="text-black text-[22px] font-semibold mb-[16px] mt-[6px] ml-4 mr-4 whitespace-pre-line leading-[28px] mt-[24px]">
        {`${feels_like}℃, 오늘 뭐 입지? \n 인기 코디 모아보기`}
      </div>
      <TopPosts posts={topPosts} />
      <div className="mt-[32px] pb-[50px] px-[20px]">
        <MoreButton content="더 보러 가기" onClick={() => router.push('/ootd')} />
      </div>
    </>
  );
}
