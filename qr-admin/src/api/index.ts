import axios from 'axios';

// Changed to local backend for testing
const API_URL = import.meta.env.VITE_API_URL?.includes('localhost') ? `http://${window.location.hostname}:8080/api` : import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8080/api`;

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getCoupons = async () => [];
export const createCoupon = async (coupon: any) => ({ ...coupon, id: Date.now().toString() });
export const deleteCoupon = async (_id: string) => {};

export const getAddons = async () => [];
export const createAddon = async (addon: any) => ({ ...addon, id: Date.now().toString() });
export const deleteAddon = async (_id: string) => {};

export const menuApi = axios.create({
  baseURL: `${API_URL}/menu`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async () => [];
export const getProducts = async () => {
  const { data } = await menuApi.get('/admin/products', { params: { t: new Date().getTime() } });
  return data.map((item: any) => ({
    ...item,
    category: item.category?.name?.split(' - ')[0] || item.category?.id || (typeof item.category === 'string' ? item.category : 'Unknown'),
    image: item.image || item.imageUrl || ''
  }));
};
export const createProduct = async (product: any) => {
  const payload = {
    ...product,
    imageUrl: product.image || product.imageUrl,
    category: typeof product.category === 'string' ? { id: product.category.toLowerCase().replace(/\s+/g, '-') } : product.category
  };
  const data = (await menuApi.post('/products', payload)).data;
  return { ...data, image: data.image || data.imageUrl || '' };
};
export const updateProduct = async (product: any) => {
  const payload = {
    ...product,
    imageUrl: product.image || product.imageUrl,
    category: typeof product.category === 'string' ? { id: product.category.toLowerCase().replace(/\s+/g, '-') } : product.category
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

export const getActiveOrders = async () => (await ordersApi.get('/active')).data;
export const getOrderHistory = async () => (await ordersApi.get('/history')).data;
export const updateOrderStatus = async (id: string, status: string) => 
  (await ordersApi.patch(`/${id}/status?status=${status}`)).data;

