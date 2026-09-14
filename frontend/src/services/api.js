import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public API (no credentials needed)
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API with credentials for admin
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR: Add token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, token ? '(with token)' : '');
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR: Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // ✅ Skip redirect for these endpoints (login, me, public data)
    const url = error.config?.url || '';
    const skipRedirect = 
      url.includes('/admin/login') ||
      url.includes('/admin/me') ||
      url.includes('/settings') ||
      url.includes('/projects') ||
      url.includes('/skills') ||
      url.includes('/journey');

    if (
      error.response?.status === 401 && 
      !skipRedirect &&
      !window.location.pathname.includes('/admin/login')
    ) {
      console.log('🔒 Session expired, redirecting to login');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;