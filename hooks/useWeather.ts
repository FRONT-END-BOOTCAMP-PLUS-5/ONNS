'use client';
import { useWeatherStore } from '@/stores/weatherState';
import { getGeoCoding } from '@/utils/weather/getGeoCoding';
import { getDustIndex, getUmbrellaIndex } from '@/utils/weather/getWeather';
import { useEffect, useState } from 'react';

export function useWeather(lat: number | null, lon: number | null) {
  const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const setWeather = useWeatherStore((s) => s.setWeather);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // lat/lon 없거나 이미 날씨값 있으면 fetch X
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      ).then((res) => res.json()),
      fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
      ).then((res) => res.json()),
      getGeoCoding(lat, lon),
    ])
      .then(([weatherData, dustData, koAddress]) => {
        const feelsLikeInt = Math.floor(weatherData.main.feels_like);
        const rain = weatherData.rain?.['1h'] ?? 0;
        const dust = dustData.list?.[0]?.components?.pm10 ?? 0;
        const name = koAddress ?? '서울';
        setWeather({
          feels_like: feelsLikeInt,
          umbrellaIndex: getUmbrellaIndex(rain),
          dustIndex: getDustIndex(dust),
          cityName: name,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('날씨/미세먼지 정보를 불러올 수 없습니다.');
        setLoading(false);
      });
  }, [lat, lon, OPENWEATHER_API_KEY, setWeather]);
  return { error, loading };
}
