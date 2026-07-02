import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost ? `http://${window.location.hostname}:8080/api` : import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';

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

let cachedCategories: any[] = [];

export const getCategories = async () => {
  try {
    const { data } = await menuApi.get('/categories');
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
  const { data } = await menuApi.get('/admin/products', { params: { t: new Date().getTime() } });
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

export const getActiveOrders = async () => (await ordersApi.get('/active')).data;
export const getOrderHistory = async () => (await ordersApi.get('/history')).data;
export const updateOrderStatus = async (id: string, status: string) => 
  (await ordersApi.patch(`/${id}/status?status=${status}`)).data;

