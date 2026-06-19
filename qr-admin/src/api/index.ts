import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoreSettings = async () => (await adminApi.get('/settings')).data;
export const updateStoreSettings = async (settings: any) => (await adminApi.post('/settings', settings)).data;

export const getCampaigns = async () => (await adminApi.get('/campaigns')).data;
export const createCampaign = async (campaign: any) => (await adminApi.post('/campaigns', campaign)).data;
export const deleteCampaign = async (id: string) => await adminApi.delete(`/campaigns/${id}`);

export const getStories = async () => (await adminApi.get('/stories')).data;
export const createStory = async (story: any) => (await adminApi.post('/stories', story)).data;
export const deleteStory = async (id: string) => await adminApi.delete(`/stories/${id}`);

export const getCoupons = async () => (await adminApi.get('/coupons')).data;
export const createCoupon = async (coupon: any) => (await adminApi.post('/coupons', coupon)).data;
export const deleteCoupon = async (id: string) => await adminApi.delete(`/coupons/${id}`);

export const getAddons = async () => (await adminApi.get('/addons')).data;
export const createAddon = async (addon: any) => (await adminApi.post('/addons', addon)).data;
export const deleteAddon = async (id: string) => await adminApi.delete(`/addons/${id}`);

export const menuApi = axios.create({
  baseURL: `${API_URL}/menu`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async () => (await menuApi.get('/categories')).data;
export const getProducts = async () => (await menuApi.get('/products')).data;

export const ordersApi = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getActiveOrders = async () => (await ordersApi.get('/active')).data;
export const updateOrderStatus = async (id: string, status: string) => 
  (await ordersApi.patch(`/${id}/status?status=${status}`)).data;
