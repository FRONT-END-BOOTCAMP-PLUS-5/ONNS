'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Slide {
  id: number;
  img: string;
}
interface HomeCarouselProps {
  slides: Slide[];
}

const HomeCarousel = ({ slides }: HomeCarouselProps) => {
  const router = useRouter();
  if (slides.length === 0) {
    return (
      <div className="w-full h-[384px] flex items-center justify-center">
        <div className="text-gray-500">이미지가 로딩 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <style jsx global>{`
        .swiper .swiper-button-next,
        .swiper .swiper-button-prev {
          display: none !important;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.my-swiper-button-next',
          prevEl: '.my-swiper-button-prev',
        }}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        spaceBetween={16}
        slidesPerView={1}
        loop
        className="w-full h-[384px] custom-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={slide.id + '-' + idx}>
            <Image
              src={slide.img}
              alt={`slide-${slide.id}`}
              fill
              className="object-cover pl-4 pr-4 cursor-pointer"
              onClick={() => router.push(`/ootd/${slide.id}`)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <div className="my-swiper-button-prev text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 z-10 cursor-pointer">
        <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div className="my-swiper-button-next text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 z-10 cursor-pointer">
        <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default HomeCarousel;
