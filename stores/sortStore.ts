import { create } from 'zustand';

interface SortState {
  sort: 'recent' | 'popular';
  setSort: (sort: 'recent' | 'popular') => void;
}

export const useSortStore = create<SortState>((set) => ({
  sort: 'recent',
  setSort: (sort) => set({ sort }),
}));
