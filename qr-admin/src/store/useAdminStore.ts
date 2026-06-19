import { create } from 'zustand';
import { MENU, CATEGORIES } from '../data/menu';
import type { MenuItem } from '../data/menu';
import type { Campaign, Story, Addon, Coupon, StoreSettings } from '../data/models';

interface AdminState {
  isStoreActive: boolean;
  toggleStoreActive: () => void;
  initializeStore: () => Promise<void>;
  
  menuItems: MenuItem[];
  categories: string[];
  
  // Settings
  featuredItems: string[];
  toggleFeaturedItem: (id: string) => void;
  
  // Store Config
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  
  // Addons (Toppings)
  addons: Addon[];
  addAddon: (addon: Addon) => void;
  updateAddon: (addon: Addon) => void;
  deleteAddon: (id: string) => void;
  toggleAddonActive: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  
  // CMS
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;

  stories: Story[];
  addStory: (story: Story) => void;
  deleteStory: (id: string) => void;

  // Track active/inactive state of items by ID
  activeItems: Record<string, boolean>;
  toggleItemActive: (id: string) => void;
  
  // Track active/inactive state of categories by Name
  activeCategories: Record<string, boolean>;
  toggleCategoryActive: (category: string) => void;

  deleteItem: (id: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
}

// Initialize all to true initially for mockup purposes
const initialActiveItems = MENU.reduce((acc, item) => {
  acc[item.id] = true;
  return acc;
}, {} as Record<string, boolean>);

const initialActiveCategories = CATEGORIES.reduce((acc, cat) => {
  acc[cat] = true;
  return acc;
}, {} as Record<string, boolean>);

export const useAdminStore = create<AdminState>((set) => ({
  isStoreActive: true,
  toggleStoreActive: async () => {
    set((state) => {
      const newState = !state.isStoreActive;
      // Also update backend
      const newSettings = { ...state.storeSettings, isStoreActive: newState };
      import('../api').then(api => api.updateStoreSettings(newSettings));
      return { isStoreActive: newState, storeSettings: newSettings };
    });
  },
  
  menuItems: MENU,
  categories: CATEGORIES,
  
  featuredItems: ['m-01', 'm-03'], // Pre-selected some featured items
  toggleFeaturedItem: (id) => set((state) => ({
    featuredItems: state.featuredItems.includes(id) 
      ? state.featuredItems.filter(itemId => itemId !== id)
      : [...state.featuredItems, id]
  })),

  initializeStore: async () => {
    try {
      const [campaigns, stories, addons, coupons, storeSettings] = await Promise.all([
        import('../api').then(m => m.getCampaigns()),
        import('../api').then(m => m.getStories()),
        import('../api').then(m => m.getAddons()),
        import('../api').then(m => m.getCoupons()),
        import('../api').then(m => m.getStoreSettings())
      ]);
      set({ 
        campaigns, 
        stories, 
        addons, 
        coupons, 
        storeSettings,
        isStoreActive: storeSettings.isStoreActive !== false // default to true
      });
    } catch (e) {
      console.error('Failed to initialize admin store from API', e);
    }
  },

  storeSettings: {
    taxRate: 5,
    deliveryFee: 40,
    packingCharge: 15,
    prepTime: 15,
  },
  updateStoreSettings: async (settings) => {
    const api = await import('../api');
    const updated = await api.updateStoreSettings(settings);
    set((state) => ({ storeSettings: { ...state.storeSettings, ...updated } }));
  },

  addons: [],
  addAddon: async (addon) => {
    const api = await import('../api');
    const created = await api.createAddon(addon);
    set((state) => ({ addons: [...state.addons, created] }));
  },
  updateAddon: async (addon) => {
    // For simplicity, using createAddon for update since it's save() in backend
    const api = await import('../api');
    const updated = await api.createAddon(addon);
    set((state) => ({ addons: state.addons.map(a => a.id === updated.id ? updated : a) }));
  },
  deleteAddon: async (id) => {
    const api = await import('../api');
    await api.deleteAddon(id);
    set((state) => ({ addons: state.addons.filter(a => a.id !== id) }));
  },
  toggleAddonActive: async (id) => {
    // Need to get the addon, flip active, and save
    set((state) => {
      const addon = state.addons.find(a => a.id === id);
      if (addon) {
        import('../api').then(api => api.createAddon({ ...addon, isActive: !addon.isActive }));
        return { addons: state.addons.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a) };
      }
      return state;
    });
  },

  coupons: [],
  addCoupon: async (coupon) => {
    const api = await import('../api');
    const created = await api.createCoupon(coupon);
    set((state) => ({ coupons: [...state.coupons, created] }));
  },
  updateCoupon: async (coupon) => {
    const api = await import('../api');
    const updated = await api.createCoupon(coupon);
    set((state) => ({ coupons: state.coupons.map(c => c.id === updated.id ? updated : c) }));
  },
  deleteCoupon: async (id) => {
    const api = await import('../api');
    await api.deleteCoupon(id);
    set((state) => ({ coupons: state.coupons.filter(c => c.id !== id) }));
  },
  toggleCouponActive: async (id) => {
    set((state) => {
      const coupon = state.coupons.find(c => c.id === id);
      if (coupon) {
        import('../api').then(api => api.createCoupon({ ...coupon, active: !coupon.active }));
        return { coupons: state.coupons.map(c => c.id === id ? { ...c, active: !c.active } : c) };
      }
      return state;
    });
  },
  
  campaigns: [],
  addCampaign: async (campaign) => {
    const api = await import('../api');
    const created = await api.createCampaign(campaign);
    set((state) => ({ campaigns: [...state.campaigns, created] }));
  },
  deleteCampaign: async (id) => {
    const api = await import('../api');
    await api.deleteCampaign(id);
    set((state) => ({ campaigns: state.campaigns.filter(c => c.id !== id) }));
  },

  stories: [],
  addStory: async (story) => {
    const api = await import('../api');
    const created = await api.createStory(story);
    set((state) => ({ stories: [...state.stories, created] }));
  },
  deleteStory: async (id) => {
    const api = await import('../api');
    await api.deleteStory(id);
    set((state) => ({ stories: state.stories.filter(s => s.id !== id) }));
  },
  
  activeItems: initialActiveItems,
  toggleItemActive: (id) => set((state) => ({
    activeItems: {
      ...state.activeItems,
      [id]: !state.activeItems[id]
    }
  })),
  
  activeCategories: initialActiveCategories,
  toggleCategoryActive: (category) => set((state) => ({
    activeCategories: {
      ...state.activeCategories,
      [category]: !state.activeCategories[category]
    }
  })),

  deleteItem: (id) => set((state) => {
    const updatedItems = state.menuItems.filter(item => item.id !== id);
    const updatedActiveItems = { ...state.activeItems };
    delete updatedActiveItems[id];
    return {
      menuItems: updatedItems,
      activeItems: updatedActiveItems
    };
  }),

  addItem: (item) => set((state) => ({
    menuItems: [...state.menuItems, item],
    activeItems: { ...state.activeItems, [item.id]: true }
  })),

  updateItem: (updatedItem) => set((state) => ({
    menuItems: state.menuItems.map(item => item.id === updatedItem.id ? updatedItem : item)
  }))
}));
