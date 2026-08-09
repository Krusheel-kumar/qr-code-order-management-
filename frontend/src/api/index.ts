import { apiClient } from '../lib/apiClient';
import type { Product, StoreSettings, Coupon, OrderPayload, UserProfile } from '../types/api';

// Public endpoint
export const getStoreSettings = async (): Promise<StoreSettings> => 
  (await apiClient.get('/public/store-status', { params: { t: new Date().getTime() } })).data;

export const getCampaigns = async () => (await apiClient.get('/discovery/campaigns')).data;
export const getStories = async () => (await apiClient.get('/discovery/stories')).data;
export const getDiscoverySections = async () => (await apiClient.get('/discovery/sections')).data;

export const getCoupons = async (): Promise<Coupon[]> => {
  // Let errors propagate to be handled by the UI/interceptor
  return (await apiClient.get('/admin/coupons')).data;
};

export const getBlacklistedProducts = async (storeId: string) => 
  (await apiClient.get(`/v2/admin/stores/${storeId}/blacklist/products`)).data;

export const getBlacklistedOptions = async (storeId: string) => 
  (await apiClient.get(`/v2/admin/stores/${storeId}/blacklist/options`)).data;

export const getAddons = async () => (await apiClient.get('/menu/addons')).data;

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get('/menu/products', { params: { t: new Date().getTime() } });
  return data.map((item: any) => ({
    ...item,
    category: item.category?.name?.split(' - ')[0] || item.category?.id || (typeof item.category === 'string' ? item.category : 'Unknown'),
    image: item.image || item.imageUrl || ''
  }));
};

export const getCategories = async () => (await apiClient.get('/menu/categories')).data;

export const verifyWidgetToken = async (data: { token: string; phoneNumber: string }) => {
  const response = await apiClient.post('/auth/verify-widget-token', data);
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Remove dangerous localStorage fallback
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: { username: string }): Promise<UserProfile> => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};

export const getUserOrders = async (userId: string) => {
  const response = await apiClient.get(`/users/${userId}/orders`);
  return response.data;
};

export const createRazorpayOrder = async (amount: number) => {
  const response = await apiClient.post('/payments/create-order', { amount });
  return response.data;
};

export const placeOrder = async (order: OrderPayload) => {
  // Input Sanitization for notes/instructions (if they exist in items)
  // Stripping simple dangerous tags before sending
  const sanitizedOrder = {
    ...order,
    items: order.items.map(item => ({
      ...item,
      customizations: item.customizations?.replace(/<[^>]*>?/gm, '')
    }))
  };
  
  const res = await apiClient.post('/orders', sanitizedOrder);
  return res.data;
};

export const getOrderById = async (id: string) => (await apiClient.get(`/orders/${id}`)).data;

// AI Engagement Layer
export const getAIContext = async (params: { orderId?: string; customerName?: string; guest?: boolean }) => {
  const res = await apiClient.get('/ai/context', { params });
  return res.data;
};

export const getGuestRewardByOrderId = async (orderId: string) => {
  const res = await apiClient.get(`/loyalty/guest/order/${orderId}`);
  return res.data;
};

export const getLoyaltyAnalytics = async () => {
  const res = await apiClient.get('/admin/loyalty/analytics');
  return res.data;
};
