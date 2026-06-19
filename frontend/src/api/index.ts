import axios from 'axios';

// Hardcoded to Railway production server for seamless Vercel deployment
const API_URL = import.meta.env.VITE_API_URL || 'https://popobob-backend-production.up.railway.app/api';

export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoreSettings = async () => (await adminApi.get('/settings')).data;
export const getCampaigns = async () => (await adminApi.get('/campaigns')).data;
export const getStories = async () => (await adminApi.get('/stories')).data;
export const getCoupons = async () => (await adminApi.get('/coupons')).data;
export const getAddons = async () => (await adminApi.get('/addons')).data;

export const menuApi = axios.create({
  baseURL: `${API_URL}/menu`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => (await menuApi.get('/products')).data;
export const getCategories = async () => (await menuApi.get('/categories')).data;

export const ordersApi = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const placeOrder = async (order: any) => (await ordersApi.post('', order)).data;
export const getOrderById = async (id: string) => (await ordersApi.get(`/${id}`)).data;
