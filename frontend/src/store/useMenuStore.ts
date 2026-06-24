import { create } from 'zustand';
import { getProducts } from '../api';
import type { MenuItem } from '../data/menu';
import { MENU as fallbackMenu } from '../data/menu';

interface MenuState {
  menuItems: MenuItem[];
  isLoading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;
  initializeMenu: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  
  getFeaturedProducts: () => MenuItem[];
  getBestSellers: () => MenuItem[];
  getNewLaunches: () => MenuItem[];
  getStaffPicks: () => MenuItem[];
  getByMood: (mood: string) => MenuItem[];
  getPairings: () => MenuItem[];
  getBakeHouseItems: () => MenuItem[];
  getBaristaItems: () => MenuItem[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  // Initialize with fallback to avoid blank screen before load
  menuItems: fallbackMenu,
  isLoading: true,
  pollingInterval: null,
  
  initializeMenu: async () => {
    try {
      const products = await getProducts();
      if (products && products.length > 0) {
        set({ menuItems: products, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch menu from backend', error);
      set({ isLoading: false });
    }
  },

  startPolling: () => {
    if (get().pollingInterval) return;
    const interval = setInterval(async () => {
      try {
        const products = await getProducts();
        if (products && products.length > 0) {
          set({ menuItems: products });
        }
      } catch (error) {
        console.error('Polling failed', error);
      }
    }, 15000);
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    if (get().pollingInterval) {
      clearInterval(get().pollingInterval!);
      set({ pollingInterval: null });
    }
  },

  getFeaturedProducts: () => get().menuItems.filter(p => p.isFeatured || p.badge === 'Signature'),
  getBestSellers: () => get().menuItems.filter(p => p.isBestseller || p.badge === 'Bestseller' || (p.ordersToday && p.ordersToday > 50)),
  getNewLaunches: () => get().menuItems.filter(p => p.isNewLaunch || p.badge === 'New'),
  getStaffPicks: () => get().menuItems.filter(p => p.staffPickNote),
  getByMood: (mood: string) => get().menuItems.filter(p => p.mood === mood && p.category !== 'Quick Bites'),
  getPairings: () => get().menuItems.filter(p => p.pairings?.length > 0).slice(0, 4),
  getBakeHouseItems: () => get().menuItems.filter(p => p.category === "Bake House"),
  getBaristaItems: () => get().menuItems.filter(p => p.category === "Barista")
}));
