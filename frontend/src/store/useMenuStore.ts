import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProducts, getCategories, getCampaigns, getStories, getDiscoverySections, getCoupons } from '../api';
import type { MenuItem } from '../data/menu';
import type { Campaign, Story, DiscoverySection, Category, Coupon } from '../data/models';


interface MenuState {
  menuItems: MenuItem[];
  categories: Category[];
  campaigns: Campaign[];
  stories: Story[];
  discoverySections: DiscoverySection[];
  coupons: Coupon[];
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
  coupons: [],
  isLoading: true,
  pollingInterval: null,
  
  initializeMenu: async () => {
    try {
      const [products, fetchedCategories, fetchedCampaigns, fetchedStories, fetchedSections, fetchedCoupons] = await Promise.all([
        getProducts().catch((e) => { console.error('Products API failed', e); return null; }),
        getCategories().catch((e) => { console.error('Categories API failed', e); return null; }),
        getCampaigns().catch((e) => { console.error('Campaigns API failed', e); return null; }),
        getStories().catch((e) => { console.error('Stories API failed', e); return null; }),
        getDiscoverySections().catch((e) => { console.error('Discovery API failed', e); return null; }),
        getCoupons().catch((e) => { console.error('Coupons API failed', e); return null; })
      ]);
      
      set((state) => ({ 
        menuItems: products !== null ? products : state.menuItems, 
        categories: fetchedCategories !== null ? fetchedCategories : state.categories,
        campaigns: fetchedCampaigns !== null ? fetchedCampaigns : state.campaigns,
        stories: fetchedStories !== null ? fetchedStories : state.stories,
        discoverySections: fetchedSections !== null ? fetchedSections : state.discoverySections,
        coupons: fetchedCoupons !== null ? fetchedCoupons : state.coupons,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Failed to fetch menu from backend', error);
      set({ isLoading: false });
    }
  },

  startPolling: () => {
    if (get().pollingInterval) return;
    const interval = setInterval(async () => {
      try {
        const [products, fetchedCategories, fetchedCampaigns, fetchedStories, fetchedSections, fetchedCoupons] = await Promise.all([
          getProducts().catch((e) => { console.error('Products API failed', e); return null; }),
          getCategories().catch((e) => { console.error('Categories API failed', e); return null; }),
          getCampaigns().catch((e) => { console.error('Campaigns API failed', e); return null; }),
          getStories().catch((e) => { console.error('Stories API failed', e); return null; }),
          getDiscoverySections().catch((e) => { console.error('Discovery API failed', e); return null; }),
          getCoupons().catch((e) => { console.error('Coupons API failed', e); return null; })
        ]);
        
        set((state) => ({ 
          menuItems: products !== null ? products : state.menuItems,
          categories: fetchedCategories !== null ? fetchedCategories : state.categories,
          campaigns: fetchedCampaigns !== null ? fetchedCampaigns : state.campaigns,
          stories: fetchedStories !== null ? fetchedStories : state.stories,
          discoverySections: fetchedSections !== null ? fetchedSections : state.discoverySections,
          coupons: fetchedCoupons !== null ? fetchedCoupons : state.coupons
        }));
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
