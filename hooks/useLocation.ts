'use client';
import { useEffect } from 'react';
import { useWeatherStore } from '@/stores/weatherState';

export function useLocation() {
  const lat = useWeatherStore((s) => s.lat);
  const lon = useWeatherStore((s) => s.lon);
  const setWeather = useWeatherStore((s) => s.setWeather);

  useEffect(() => {
    // 이미 위치값 있으면 skip
    if (lat && lon) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setWeather({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          // 권한 거부/오류 시 fallback(서울)
          console.error(err);
          setWeather({ lat: 37.5665, lon: 126.978 });
        },
      );
    }
  }, [lat, lon, setWeather]);

  return { lat, lon };
}
