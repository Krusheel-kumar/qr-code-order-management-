import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname);
const API_URL = isLocalhost ? `http://${window.location.hostname}:8080/api` : import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';

export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminV2Api = axios.create({
  baseURL: `${API_URL}/v2/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const applyAuthInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use((config: any) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response && error.response.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );
};

applyAuthInterceptor(adminApi);
applyAuthInterceptor(adminV2Api);

export const getStoreSettings = async () => (await adminApi.get('/settings', { params: { t: new Date().getTime() } })).data;
export const updateStoreSettings = async (settings: any) => (await adminApi.post('/settings', settings)).data;

// --- Discovery Sections API ---
export const getDiscoverySections = async () => (await adminApi.get('/discovery-sections')).data;
export const createDiscoverySection = async (section: any) => (await adminApi.post('/discovery-sections', section)).data;
export const deleteDiscoverySection = async (id: string) => await adminApi.delete(`/discovery-sections/${id}`);

export const getCampaigns = async () => (await adminApi.get('/campaigns')).data;
export const createCampaign = async (campaign: any) => (await adminApi.post('/campaigns', campaign)).data;
export const deleteCampaign = async (id: string) => await adminApi.delete(`/campaigns/${id}`);

export const getStories = async () => (await adminApi.get('/stories')).data;
export const createStory = async (story: any) => (await adminApi.post('/stories', story)).data;
export const deleteStory = async (id: string) => await adminApi.delete(`/stories/${id}`);

export const getCoupons = async () => (await adminApi.get('/coupons')).data;
export const createCoupon = async (coupon: any) => (await adminApi.post('/coupons', coupon)).data;
export const deleteCoupon = async (id: string) => await adminApi.delete(`/coupons/${id}`);

export const getAddons = async () => [];
export const createAddon = async (addon: any) => ({ ...addon, id: Date.now().toString() });
export const deleteAddon = async (_id: string) => {};

// --- Customization Groups API (V2) ---
export const getCustomizationGroups = async () => (await adminV2Api.get('/customization-groups')).data;
export const createCustomizationGroup = async (group: any) => (await adminV2Api.post('/customization-groups', group)).data;
export const updateCustomizationGroup = async (id: string, group: any) => (await adminV2Api.put(`/customization-groups/${encodeURIComponent(id)}`, group)).data;
export const deleteCustomizationGroup = async (id: string) => await adminV2Api.delete(`/customization-groups/${encodeURIComponent(id)}`);

// --- Customization Options API (V2) ---
export const getCustomizationOptions = async () => (await adminV2Api.get('/customization-options')).data;
export const createCustomizationOption = async (option: any) => (await adminV2Api.post('/customization-options', option)).data;
export const updateCustomizationOption = async (id: string, option: any) => (await adminV2Api.put(`/customization-options/${encodeURIComponent(id)}`, option)).data;
export const deleteCustomizationOption = async (id: string) => await adminV2Api.delete(`/customization-options/${encodeURIComponent(id)}`);

export const menuApi = axios.create({
  baseURL: `${API_URL}/menu`,
  headers: {
    'Content-Type': 'application/json',
  },
});

applyAuthInterceptor(menuApi);

let cachedCategories: any[] = [];

export const getCategories = async () => {
  try {
    const response = await menuApi.get('/categories');
    console.log("API CATEGORIES", response.data);
    const { data } = response;
    cachedCategories = data;
    return data;
  } catch (e) {
    return [];
  }
};

export const addCategory = async (category: any) => {
  const { data } = await menuApi.post('/categories', category);
  cachedCategories.push(data);
  return data;
};

export const updateCategory = async (id: string, category: any) => {
  const { data } = await menuApi.put(`/categories/${id}`, category);
  const index = cachedCategories.findIndex(c => c.id === id);
  if (index !== -1) cachedCategories[index] = data;
  return data;
};

export const deleteCategory = async (id: string) => {
  await menuApi.delete(`/categories/${id}`);
  cachedCategories = cachedCategories.filter(c => c.id !== id);
};

export const getProducts = async () => {
  const response = await menuApi.get('/admin/products', { params: { t: new Date().getTime() } });
  console.log("API PRODUCTS", response.data);
  const { data } = response;
  return data.map((item: any) => ({
    ...item,
    category: item.category?.name?.split(' - ')[0] || item.category?.id || (typeof item.category === 'string' ? item.category : 'Unknown'),
    image: item.image || item.imageUrl || ''
  }));
};

const resolveCategory = (catStr: any) => {
  if (typeof catStr !== 'string') return catStr;
  const found = cachedCategories.find(c => c.name === catStr || c.name.startsWith(catStr + ' -'));
  if (found) return { id: found.id };
  return { id: catStr.toLowerCase().replace(/\s+/g, '-') };
};

export const createProduct = async (product: any) => {
  const payload = {
    ...product,
    imageUrl: product.image || product.imageUrl,
    category: resolveCategory(product.category)
  };
  const data = (await menuApi.post('/products', payload)).data;
  return { ...data, image: data.image || data.imageUrl || '' };
};

export const updateProduct = async (product: any) => {
  const payload = {
    ...product,
    imageUrl: product.image || product.imageUrl,
    category: resolveCategory(product.category)
  };
  const data = (await menuApi.post('/products', payload)).data;
  return { ...data, image: data.image || data.imageUrl || '' };
};

export const deleteProduct = async (id: string) => (await menuApi.delete(`/products/${id}`)).data;

export const ordersApi = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

applyAuthInterceptor(ordersApi);

export const getActiveOrders = async () => (await ordersApi.get('/active')).data;
export const getOrderHistory = async () => (await ordersApi.get('/history')).data;
export const updateOrderStatus = async (id: string, status: string) => 
  (await ordersApi.patch(`/${id}/status?status=${status}`)).data;

// --- Product Customization Group Mapping (V2) ---
export const getProductCustomizationGroups = async (productId: string) => 
  (await adminV2Api.get(`/products/${productId}/customization-groups`)).data;

export const assignProductCustomizationGroup = async (productId: string, groupId: string) => 
  (await adminV2Api.post(`/products/${productId}/customization-groups`, { customizationGroupId: groupId })).data;

export const removeProductCustomizationGroup = async (productId: string, groupId: string) => 
  (await adminV2Api.delete(`/products/${productId}/customization-groups/${encodeURIComponent(groupId)}`)).data;

export const reorderProductCustomizationGroups = async (productId: string, groupIds: string[]) => 
  (await adminV2Api.put(`/products/${productId}/customization-groups/reorder`, { groupIds })).data;

// --- Store Blacklists (V2) ---
export const getStoreProductBlacklist = async (storeId: string) => 
  (await adminV2Api.get(`/stores/${storeId}/blacklist/products`)).data;

export const blacklistProductAtStore = async (storeId: string, productId: string) => 
  (await adminV2Api.post(`/stores/${storeId}/blacklist/products`, { productId })).data;

export const removeProductFromStoreBlacklist = async (storeId: string, productId: string) => 
  (await adminV2Api.delete(`/stores/${storeId}/blacklist/products/${productId}`)).data;

export const getStoreOptionBlacklist = async (storeId: string) => 
  (await adminV2Api.get(`/stores/${storeId}/blacklist/options`)).data;

export const blacklistOptionAtStore = async (storeId: string, optionId: string) => 
  (await adminV2Api.post(`/stores/${storeId}/blacklist/options`, { optionId })).data;

export const removeOptionFromStoreBlacklist = async (storeId: string, optionId: string) => 
  (await adminV2Api.delete(`/stores/${storeId}/blacklist/options/${optionId}`)).data;

// --- Loyalty Analytics ---
export const getLoyaltyAnalytics = async () => 
  (await adminApi.get('/loyalty/analytics')).data;

