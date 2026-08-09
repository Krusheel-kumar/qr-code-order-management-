import axios, { AxiosError } from 'axios';

// Detect environment to assign API URL dynamically
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(window.location.hostname);

const API_URL = isLocalhost 
  ? `http://${window.location.hostname}:8080/api` 
  : import.meta.env.VITE_API_URL || 'https://qr-code-order-management-production.up.railway.app/api';

// Create a single global axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure we timeout instead of hanging infinitely
  timeout: 15000, 
});

// Request Interceptor: Attach Auth Tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Check local storage for token if Auth is implemented
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize Error Handling globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Prevent silent failures. If there is no response, the server is down or network failed.
    if (!error.response) {
      console.error('Network/Server Error:', error.message);
      // We can dispatch a global toast event here later
    } else if (error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear store)
      console.warn('Unauthorized access detected');
    }
    
    // Always propagate the error so components can show local states
    return Promise.reject(error);
  }
);
