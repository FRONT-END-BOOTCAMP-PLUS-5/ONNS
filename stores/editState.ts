import { create } from 'zustand';

interface EditState {
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  toggleEdit: () => void;
}

export const useEditStore = create<EditState>((set) => ({
  isEdit: false,
  setIsEdit: (value) => set({ isEdit: value }),
  toggleEdit: () => set((state) => ({ isEdit: !state.isEdit })),
}));
