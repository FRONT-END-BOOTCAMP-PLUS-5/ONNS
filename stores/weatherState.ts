import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherState {
  feels_like: number | null;
  umbrellaIndex: boolean | null;
  dustIndex: boolean | null;
  cityName: string | null;
  lat: number | null;
  lon: number | null;
  setWeather: (data: Partial<WeatherState>) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      feels_like: null,
      umbrellaIndex: null,
      dustIndex: null,
      cityName: null,
      lat: null,
      lon: null,
      setWeather: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'weather-store',
    },
  ),
);
