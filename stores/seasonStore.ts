import { create } from 'zustand';

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  if (month >= 9 && month <= 11) return '가을';
  return '겨울';
}

interface SeasonState {
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
}

export const useSeasonStore = create<SeasonState>((set) => ({
  selectedSeason: getCurrentSeason(),
  setSelectedSeason: (season: string) => set({ selectedSeason: season }),
}));
