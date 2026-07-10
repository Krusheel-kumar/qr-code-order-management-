import axios from 'axios';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname);
const API_URL = isLocalhost ? `http://${window.location.hostname}:8080/api` : import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';
// Public endpoint — no authentication required.
// Returns: storeActive, taxRate, deliveryFee, packingCharge, prepTime
export const getStoreSettings = async () => (await axios.get(`${API_URL}/public/store-status`, { params: { t: new Date().getTime() } })).data;
export const getCampaigns = async () => (await axios.get(`${API_URL}/discovery/campaigns`)).data;
export const getStories = async () => (await axios.get(`${API_URL}/discovery/stories`)).data;
export const getDiscoverySections = async () => (await axios.get(`${API_URL}/discovery/sections`)).data;
export const getCoupons = async () => {
  try {
    return (await axios.get(`${API_URL}/admin/coupons`)).data;
  } catch (e) {
    return [];
  }
};
export const getBlacklistedProducts = async (storeId: string) => {
  try {
    return (await axios.get(`${API_URL}/v2/admin/stores/${storeId}/blacklist/products`)).data;
  } catch (e) {
    return [];
  }
};
export const getBlacklistedOptions = async (storeId: string) => {
  try {
    return (await axios.get(`${API_URL}/v2/admin/stores/${storeId}/blacklist/options`)).data;
  } catch (e) {
    return [];
  }
};
export const getAddons = async () => (await axios.get(`${API_URL}/menu/addons`)).data;

export const menuApi = axios.create({
  baseURL: `${API_URL}/menu`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  const { data } = await menuApi.get('/products', { params: { t: new Date().getTime() } });
  return data.map((item: any) => ({
    ...item,
    category: item.category?.name?.split(' - ')[0] || item.category?.id || (typeof item.category === 'string' ? item.category : 'Unknown'),
    image: item.image || item.imageUrl || ''
  }));
};
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

// AI Engagement Layer
export const getAIContext = async (params: { orderId?: string; customerName?: string; guest?: boolean }) => {
  try {
    const res = await axios.get(`${API_URL}/ai/context`, { params });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const getGuestRewardByOrderId = async (orderId: string) => {
  try {
    const res = await axios.get(`${API_URL}/loyalty/guest/order/${orderId}`);
    return res.data;
  } catch (e) {
    return null;
  }
};

export const getLoyaltyAnalytics = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/loyalty/analytics`);
    return res.data;
  } catch (e) {
    return null;
  }
};
