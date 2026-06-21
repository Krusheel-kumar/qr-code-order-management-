import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  loyaltyPoints: number;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  getLoyaltyTier: () => { name: string; color: string; nextTier: number; progress: number };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getLoyaltyTier: () => {
        const points = get().user?.loyaltyPoints || 0;
        if (points >= 2000) return { name: 'Gold Boba', color: 'from-[#FFD700] to-[#FDB931]', nextTier: 5000, progress: 100 };
        if (points >= 500) return { name: 'Silver Boba', color: 'from-[#C0C0C0] to-[#E8E8E8]', nextTier: 2000, progress: (points / 2000) * 100 };
        return { name: 'Bronze Boba', color: 'from-[#CD7F32] to-[#B87333]', nextTier: 500, progress: (points / 500) * 100 };
      }
    }),
    {
      name: 'popobob-auth-storage',
    }
  )
);
