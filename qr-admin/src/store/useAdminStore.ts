import { create } from 'zustand';
import { 
  getStoreSettings, 
  updateStoreSettings, 
  getProducts, 
  getCampaigns, 
  getStories, 
  getDiscoverySections, 
  getCategories 
} from '../api';
import type { MenuItem } from '../data/menu';
import type { Campaign, Story, Addon, Coupon, StoreSettings, DiscoverySection } from '../data/models';

interface AdminState {
  isStoreActive: boolean;
  toggleStoreActive: () => void;
  initializeStore: () => Promise<void>;
  
  menuItems: MenuItem[];
  categories: string[];
  categoryDetails: any[];
  addCategory: (category: any) => void;
  updateCategory: (id: string, category: any) => void;
  deleteCategory: (id: string) => void;
  
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

  discoverySections: DiscoverySection[];
  addDiscoverySection: (section: DiscoverySection) => void;
  deleteDiscoverySection: (id: string) => void;
  updateDiscoverySection: (section: DiscoverySection) => void;

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
const initialActiveItems = {} as Record<string, boolean>;

const initialActiveCategories = {} as Record<string, boolean>;

export const useAdminStore = create<AdminState>((set) => ({
  isStoreActive: true,
  toggleStoreActive: async () => {
    set((state) => {
      // 1. Flip the active state
      const newState = !state.isStoreActive;
      
      // 2. Prepare the payload exactly as the backend expects it
      const newSettings = { ...state.storeSettings, storeActive: newState };
      
      // 3. Update the backend asynchronously
      updateStoreSettings(newSettings)
        .catch(err => console.error("Failed to update store status:", err));
        
      // 4. Update the frontend UI optimistically
      return { isStoreActive: newState, storeSettings: newSettings };
    });
  },
  
  menuItems: [],
  categories: [],
  categoryDetails: [],
  
  addCategory: async (category: any) => {
    try {
      const addedCategory = await import('../api').then(m => m.addCategory(category));
      set((state) => ({
        categoryDetails: [...state.categoryDetails, addedCategory],
        categories: [...state.categories, addedCategory.name],
        activeCategories: {
          ...state.activeCategories,
          [addedCategory.name]: true
        }
      }));
    } catch (e) {
      console.error('Failed to add category', e);
    }
  },
  
  updateCategory: async (id: string, category: any) => {
    try {
      const updatedCategory = await import('../api').then(m => m.updateCategory(id, category));
      set((state) => {
        const oldCategory = state.categoryDetails.find(c => c.id === id);
        const oldName = oldCategory ? oldCategory.name : '';
        const newCategoryDetails = state.categoryDetails.map(c => c.id === id ? updatedCategory : c);
        const newCategories = newCategoryDetails.map(c => c.name);
        
        // Handle renaming in activeCategories if name changed
        const newActiveCategories = { ...state.activeCategories };
        if (oldName && oldName !== updatedCategory.name) {
          newActiveCategories[updatedCategory.name] = newActiveCategories[oldName];
          delete newActiveCategories[oldName];
        }

        return {
          categoryDetails: newCategoryDetails,
          categories: newCategories,
          activeCategories: newActiveCategories
        };
      });
    } catch (e) {
      console.error("Failed to update category", e);
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await import('../api').then(m => m.deleteCategory(id));
      set((state) => {
        const categoryToDelete = state.categoryDetails.find(c => c.id === id);
        const nameToDelete = categoryToDelete ? categoryToDelete.name : '';
        
        const newCategoryDetails = state.categoryDetails.filter(c => c.id !== id);
        const newCategories = newCategoryDetails.map(c => c.name);
        
        const newActiveCategories = { ...state.activeCategories };
        if (nameToDelete) {
          delete newActiveCategories[nameToDelete];
        }

        return {
          categoryDetails: newCategoryDetails,
          categories: newCategories,
          activeCategories: newActiveCategories
        };
      });
    } catch (e) {
      console.error("Failed to delete category", e);
    }
  },
  
  featuredItems: ['m-01', 'm-03'], // Pre-selected some featured items
  toggleFeaturedItem: (id) => set((state) => ({
    featuredItems: state.featuredItems.includes(id) 
      ? state.featuredItems.filter(itemId => itemId !== id)
      : [...state.featuredItems, id]
  })),

  initializeStore: async () => {
    const [settingsResult, productsResult, campaignsResult, storiesResult, discoverySectionsResult, categoriesResult] = await Promise.allSettled([
      getStoreSettings(),
      getProducts(),
      getCampaigns(),
      getStories(),
      getDiscoverySections(),
      getCategories()
    ]);

    // --- Status report for each promise ---
    console.log("========== PROMISE STATUS REPORT ==========");
    console.log("settings:         ", settingsResult.status,         settingsResult.status === 'rejected' ? settingsResult.reason : '');
    console.log("products:         ", productsResult.status,         productsResult.status === 'rejected' ? productsResult.reason : '');
    console.log("campaigns:        ", campaignsResult.status,        campaignsResult.status === 'rejected' ? campaignsResult.reason : '');
    console.log("stories:          ", storiesResult.status,          storiesResult.status === 'rejected' ? storiesResult.reason : '');
    console.log("discoverySections:", discoverySectionsResult.status, discoverySectionsResult.status === 'rejected' ? discoverySectionsResult.reason : '');
    console.log("categories:       ", categoriesResult.status,       categoriesResult.status === 'rejected' ? categoriesResult.reason : '');

    // --- Fulfilled values ---
    console.log("========== FULFILLED VALUES ==========");
    if (settingsResult.status         === 'fulfilled') console.log("settings value:",          settingsResult.value);
    if (productsResult.status         === 'fulfilled') console.log("products value:",          productsResult.value);
    if (campaignsResult.status        === 'fulfilled') console.log("campaigns value:",         campaignsResult.value);
    if (storiesResult.status          === 'fulfilled') console.log("stories value:",           storiesResult.value);
    if (discoverySectionsResult.status === 'fulfilled') console.log("discoverySections value:", discoverySectionsResult.value);
    if (categoriesResult.status       === 'fulfilled') console.log("categories value:",        categoriesResult.value);

    // Extract values, falling back to safe defaults for rejected promises
    const storeSettings      = settingsResult.status         === 'fulfilled' ? settingsResult.value         : undefined;
    const products           = productsResult.status         === 'fulfilled' ? productsResult.value         : [];
    const campaigns          = campaignsResult.status        === 'fulfilled' ? campaignsResult.value        : [];
    const stories            = storiesResult.status          === 'fulfilled' ? storiesResult.value          : [];
    const discoverySections  = discoverySectionsResult.status === 'fulfilled' ? discoverySectionsResult.value : [];
    const categories         = categoriesResult.status       === 'fulfilled' ? categoriesResult.value       : [];

    const newActiveItems = { ...useAdminStore.getState().activeItems };
    if (products.length > 0) {
      products.forEach((p: any) => {
        newActiveItems[p.id] = p.isAvailable !== false;
      });
    }

    const setPayload: any = {
      menuItems:       products,
      categories:      categories.map((c: any) => c.name),
      categoryDetails: categories,
      activeItems:     newActiveItems,
      campaigns,
      stories,
      discoverySections,
    };
    if (storeSettings !== undefined) {
      setPayload.storeSettings  = storeSettings;
      setPayload.isStoreActive  = storeSettings.storeActive !== false;
    }

    console.log("========== SET() PAYLOAD ==========");
    console.log("menuItems (count):",       setPayload.menuItems.length);
    console.log("categories:",              setPayload.categories);
    console.log("categoryDetails (count):", setPayload.categoryDetails.length);
    console.log("campaigns (count):",       setPayload.campaigns.length);
    console.log("stories (count):",         setPayload.stories.length);
    console.log("discoverySections (count):", setPayload.discoverySections.length);
    console.log("storeSettings:",           setPayload.storeSettings);
    console.log("full payload:",            setPayload);

    set(() => setPayload);

    console.log("========== AFTER SET ==========");
    console.log("Store menuItems:",   useAdminStore.getState().menuItems.length);
    console.log("Store categories:",  useAdminStore.getState().categories.length);
  },

  storeSettings: {
    taxRate: 5,
    deliveryFee: 40,
    packingCharge: 15,
    prepTime: 15,
    storeActive: true,
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

  discoverySections: [],
  addDiscoverySection: async (section) => {
    const api = await import('../api');
    const created = await api.createDiscoverySection(section);
    set((state) => ({ discoverySections: [...state.discoverySections, created] }));
  },
  updateDiscoverySection: async (section) => {
    const api = await import('../api');
    const updated = await api.createDiscoverySection(section);
    set((state) => ({ discoverySections: state.discoverySections.map(s => s.id === updated.id ? updated : s) }));
  },
  deleteDiscoverySection: async (id) => {
    const api = await import('../api');
    await api.deleteDiscoverySection(id);
    set((state) => ({ discoverySections: state.discoverySections.filter(s => s.id !== id) }));
  },
  
  activeItems: initialActiveItems,
  toggleItemActive: async (id) => {
    try {
      const api = await import('../api');
      const item = useAdminStore.getState().menuItems.find(i => i.id === id);
      const isActive = !useAdminStore.getState().activeItems[id];
      if (item) {
        await api.updateProduct({ ...item, isAvailable: isActive });
      }
      set((state) => ({
        activeItems: {
          ...state.activeItems,
          [id]: isActive
        }
      }));
    } catch (e) { console.error('Failed to toggle', e); }
  },
  
  activeCategories: initialActiveCategories,
  toggleCategoryActive: (category) => set((state) => ({
    activeCategories: {
      ...state.activeCategories,
      [category]: !state.activeCategories[category]
    }
  })),

  deleteItem: async (id) => {
    try {
      const api = await import('../api');
      await api.deleteProduct(id);
      set((state) => {
        const updatedItems = state.menuItems.filter(item => item.id !== id);
        const updatedActiveItems = { ...state.activeItems };
        delete updatedActiveItems[id];
        return {
          menuItems: updatedItems,
          activeItems: updatedActiveItems
        };
      });
    } catch (e) { console.error('Failed to delete', e); }
  },

  addItem: async (item) => {
    try {
      const api = await import('../api');
      const created = await api.createProduct(item);
      const categoryStr = created.category?.name || created.category?.id || item.category;
      // Map it back to the format the UI expects
      const finalItem = { ...item, ...created, category: categoryStr, image: created.imageUrl || created.image || item.image };
      set((state) => ({
        menuItems: [...state.menuItems, finalItem],
        activeItems: { ...state.activeItems, [finalItem.id]: true }
      }));
    } catch (e: any) { 
      console.error('Failed to add', e);
      alert(`Failed to add item: ${e.response?.data?.message || e.message || 'Unknown error'}`);
    }
  },

  updateItem: async (updatedItem) => {
    try {
      const api = await import('../api');
      const updated = await api.updateProduct(updatedItem);
      const categoryStr = updated.category?.name || updated.category?.id || updatedItem.category;
      // Map it back to the format the UI expects
      const finalItem = { ...updatedItem, ...updated, category: categoryStr, image: updated.imageUrl || updated.image || updatedItem.image };
      set((state) => ({
        menuItems: state.menuItems.map(item => item.id === finalItem.id ? finalItem : item)
      }));
    } catch (e) { console.error('Failed to update', e); }
  }
}));
