import axios from 'axios';

const API_URL = 'https://popobob-backend-production.up.railway.app/api';

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


export const registerUser = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (response.ok) return await response.json();
  const err = await response.text();
  throw new Error(err || 'Registration failed');
};

export const getUserProfile = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (response.ok) return await response.json();
    throw new Error('Fallback to mock');
  } catch (e) {
    const userKey = Object.keys(localStorage).find(k => k.startsWith('mock_user_'));
    if (userKey) {
      return JSON.parse(localStorage.getItem(userKey)!);
    }
    return null;
  }
};

export const loginUser = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (response.ok) return await response.json();
  const err = await response.text();
  throw new Error(err || 'Login failed');
};

export const getUserOrders = async (userId: string) => {
  const response = await fetch(`${API_URL}/users/${userId}/orders`);
  if (response.ok) return await response.json();
  return [];
};

export const ordersApi = axios.create({
  baseURL: `${API_URL}/orders`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createRazorpayOrder = async (amount: number) => {
  const response = await fetch(`${API_URL}/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (response.ok) return await response.json();
  throw new Error('Payment initialization failed');
};

export const placeOrder = async (order: any) => {
  const res = await ordersApi.post('', order);
  return res.data;
};
export const getOrderById = async (id: string) => (await ordersApi.get(`/${id}`)).data;
