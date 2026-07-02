import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProducts, getCategories, getCampaigns, getStories, getDiscoverySections } from '../api';
import type { MenuItem } from '../data/menu';
import type { Campaign, Story, DiscoverySection, Category } from '../data/models';


interface MenuState {
  menuItems: MenuItem[];
  categories: Category[];
  campaigns: Campaign[];
  stories: Story[];
  discoverySections: DiscoverySection[];
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

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
  // Initialize empty
  menuItems: [],
  categories: [],
  campaigns: [],
  stories: [],
  discoverySections: [],
  isLoading: true,
  pollingInterval: null,
  
  initializeMenu: async () => {
    try {
      const [products, fetchedCategories, fetchedCampaigns, fetchedStories, fetchedSections] = await Promise.all([
        getProducts().catch(() => []),
        getCategories().catch(() => []),
        getCampaigns().catch(() => []),
        getStories().catch(() => []),
        getDiscoverySections().catch(() => [])
      ]);
      
      set({ 
        menuItems: products || [], 
        categories: fetchedCategories || [],
        campaigns: fetchedCampaigns || [],
        stories: fetchedStories || [],
        discoverySections: fetchedSections || [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch menu from backend', error);
      set({ isLoading: false });
    }
  },

  startPolling: () => {
    if (get().pollingInterval) return;
    const interval = setInterval(async () => {
      try {
        const [products, fetchedCategories, fetchedCampaigns, fetchedStories, fetchedSections] = await Promise.all([
          getProducts().catch(() => []),
          getCategories().catch(() => []),
          getCampaigns().catch(() => []),
          getStories().catch(() => []),
          getDiscoverySections().catch(() => [])
        ]);
        if (products) {
          set({ 
            menuItems: products,
            categories: fetchedCategories || [],
            campaigns: fetchedCampaigns || [],
            stories: fetchedStories || [],
            discoverySections: fetchedSections || []
          });
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
    }
  ),
  {
    name: 'pop-o-bob-menu-cache',
    partialize: (state) => ({
      menuItems: state.menuItems,
      campaigns: state.campaigns,
      stories: state.stories,
      discoverySections: state.discoverySections
    })
  }
));
