import { create } from 'zustand';

export type MascotMood = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'sleeping' | 'hidden';

interface MascotState {
  mood: MascotMood;
  isEnabled: boolean;
  setMood: (mood: MascotMood) => void;
  toggleMascot: () => void;
}

export const useMascotStore = create<MascotState>((set) => ({
  mood: 'happy',
  isEnabled: true, // Default to true, can be toggled off
  setMood: (mood) => set({ mood }),
  toggleMascot: () => set((state) => ({ isEnabled: !state.isEnabled })),
}));
