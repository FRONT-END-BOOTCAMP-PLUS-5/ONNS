import { create } from 'zustand';

interface TempFilterState {
  selectedTemp: string;
  setSelectedTemp: (temp: string) => void;
}

export const useTempFilterStore = create<TempFilterState>((set) => ({
  selectedTemp: '전체',
  setSelectedTemp: (temp) => set({ selectedTemp: temp }),
}));
