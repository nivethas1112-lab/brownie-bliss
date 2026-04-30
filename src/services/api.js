import axios from 'axios';
import env from '../config/env.js';
import { useAuthStore } from '../stores/useAuthStore.js';

/**
 * API Client - Axios instance with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

const apiClient = axios.create({
  baseURL: env.getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const isOfflineMutationError = (error) => {
  const status = error?.response?.status;
  return (
    !error?.response ||
    status === 404 ||
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('Network Error')
  );
};

const safeMutation = async (requestFn, fallback = {}) => {
  try {
    return await requestFn();
  } catch (error) {
    if (isOfflineMutationError(error)) {
      return fallback;
    }
    throw error;
  }
};

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(env.authTokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle common response logic
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response: axiosResponse } = error;

    if (axiosResponse) {
      const { status, data } = axiosResponse;

      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - clear both persisted token and in-memory auth state
          localStorage.removeItem(env.authTokenKey);
          useAuthStore.getState().clearCredentials();
          if (window.location.pathname !== '/admin/login') {
            window.location.assign('/admin/login');
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data?.message || 'Insufficient permissions');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 429:
          // Rate limited
          console.error('Too many requests. Please try again later.');
          break;
        default:
          console.error(`API Error ${status}:`, data?.message || 'Unknown error');
      }
    } else {
      // Network error or request setup error
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Service - All backend endpoints
 */
export const api = {
  // ==================== Authentication ====================
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
    me: () => apiClient.get('/auth/me'),
  },

  // ==================== Products ====================
  products: {
    getAll: (params = {}) => apiClient.get('/products', { params }),
    getById: (id) => apiClient.get(`/products/${id}`),
    getByCategory: (category, params = {}) =>
      apiClient.get(`/products/category/${category}`, { params }),
    create: (data) => safeMutation(() => apiClient.post('/products', data), { product: data }),
    update: (id, data) => safeMutation(() => apiClient.put(`/products/${id}`, data), { id, ...data }),
    delete: (id) => safeMutation(() => apiClient.delete(`/products/${id}`), { id, deleted: true }),
  },

  // ==================== Categories ====================
  categories: {
    getAll: () => apiClient.get('/categories'),
    getById: (id) => apiClient.get(`/categories/${id}`),
    create: (data) => safeMutation(() => apiClient.post('/categories', data), { category: data }),
    update: (id, data) => safeMutation(() => apiClient.put(`/categories/${id}`, data), { id, ...data }),
    delete: (id) => safeMutation(() => apiClient.delete(`/categories/${id}`), { id, deleted: true }),
  },

  // ==================== Cart ====================
  cart: {
    get: () => apiClient.get('/cart'),
    addItem: (productId, quantity = 1) =>
      apiClient.post('/cart/items', { productId, quantity }),
    updateItem: (itemId, quantity) =>
      apiClient.put(`/cart/items/${itemId}`, { quantity }),
    removeItem: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
    clear: () => apiClient.delete('/cart'),
  },

  // ==================== Orders ====================
  orders: {
    getAll: (params = {}) => apiClient.get('/orders', { params }),
    getById: (id) => apiClient.get(`/orders/${id}`),
    create: (data) => safeMutation(() => apiClient.post('/orders', data), { order: data }),
    updateStatus: (id, status) => safeMutation(() => apiClient.patch(`/orders/${id}/status`, { status }), { id, status }),
    cancel: (id) => safeMutation(() => apiClient.patch(`/orders/${id}/cancel`), { id, cancelled: true }),
  },

  // ==================== Customers ====================
  customers: {
    getAll: (params = {}) => apiClient.get('/customers', { params }),
    getById: (id) => apiClient.get(`/customers/${id}`),
    update: (id, data) => safeMutation(() => apiClient.put(`/customers/${id}`, data), { id, ...data }),
    delete: (id) => safeMutation(() => apiClient.delete(`/customers/${id}`), { id, deleted: true }),
  },

  // ==================== Coupons ====================
  coupons: {
    getAll: () => apiClient.get('/coupons'),
    getById: (id) => apiClient.get(`/coupons/${id}`),
    create: (data) => safeMutation(() => apiClient.post('/coupons', data), { coupon: data }),
    update: (id, data) => safeMutation(() => apiClient.put(`/coupons/${id}`, data), { id, ...data }),
    delete: (id) => safeMutation(() => apiClient.delete(`/coupons/${id}`), { id, deleted: true }),
    validate: (code) => apiClient.post('/coupons/validate', { code }),
  },

   // ==================== Shipping ====================
   shipping: {
     getZones: () => apiClient.get('/shipping/zones'),
     createZone: (data) => safeMutation(() => apiClient.post('/shipping/zones', data), { zone: data }),
     updateZone: (id, data) => safeMutation(() => apiClient.put(`/shipping/zones/${id}`, data), { id, ...data }),
     deleteZone: (id) => safeMutation(() => apiClient.delete(`/shipping/zones/${id}`), { id, deleted: true }),
   },

   // ==================== Transactions ====================
   transactions: {
     getAll: (params = {}) => apiClient.get('/transactions', { params }),
     getById: (id) => apiClient.get(`/transactions/${id}`),
     update: (id, data) => safeMutation(() => apiClient.patch(`/transactions/${id}`, data), { id, ...data }),
   },

  // ==================== Inquiries ====================
  inquiries: {
    getAll: () => apiClient.get('/inquiries'),
    getById: (id) => apiClient.get(`/inquiries/${id}`),
    create: (data) => safeMutation(() => apiClient.post('/inquiries', data), { inquiry: data }),
    updateStatus: (id, status) => safeMutation(() => apiClient.patch(`/inquiries/${id}/status`, { status }), { id, status }),
    delete: (id) => safeMutation(() => apiClient.delete(`/inquiries/${id}`), { id, deleted: true }),
  },

   // ==================== Blogs ====================
   blogs: {
     getAll: (params = {}) => apiClient.get('/blogs', { params }),
     getById: (id) => apiClient.get(`/blogs/${id}`),
     create: (data) => safeMutation(() => apiClient.post('/blogs', data), { blog: data }),
     update: (id, data) => safeMutation(() => apiClient.put(`/blogs/${id}`, data), { id, ...data }),
     delete: (id) => safeMutation(() => apiClient.delete(`/blogs/${id}`), { id, deleted: true }),
   },

   // ==================== Users/Admins ====================
   users: {
     getAll: (params = {}) => apiClient.get('/users', { params }),
     getById: (id) => apiClient.get(`/users/${id}`),
     create: (data) => safeMutation(() => apiClient.post('/users', data), { user: data }),
     update: (id, data) => safeMutation(() => apiClient.put(`/users/${id}`, data), { id, ...data }),
     delete: (id) => safeMutation(() => apiClient.delete(`/users/${id}`), { id, deleted: true }),
     toggleStatus: (id, isActive) => safeMutation(() => apiClient.patch(`/users/${id}/toggle-status`, { isActive }), { id, isActive }),
   },

  // ==================== Testimonials ====================
  testimonials: {
    getAll: () => apiClient.get('/testimonials'),
    getById: (id) => apiClient.get(`/testimonials/${id}`),
    create: (data) => safeMutation(() => apiClient.post('/testimonials', data), { testimonial: data }),
    update: (id, data) => safeMutation(() => apiClient.put(`/testimonials/${id}`, data), { id, ...data }),
    delete: (id) => safeMutation(() => apiClient.delete(`/testimonials/${id}`), { id, deleted: true }),
    approve: (id) => safeMutation(() => apiClient.patch(`/testimonials/${id}/approve`), { id, approved: true }),
  },

  // ==================== File Uploads ====================
  upload: {
    image: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiClient.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },

  // ==================== Dashboard Stats ====================
  dashboard: {
    getStats: (params = {}) => apiClient.get('/dashboard/stats', { params }),
    getRecentOrders: (limit = 5) => apiClient.get(`/dashboard/recent-orders?limit=${limit}`),
    getSalesData: (range = '7d') => apiClient.get(`/dashboard/sales?range=${range}`),
  },

  // ==================== Health Check ====================
  health: () => apiClient.get('/health'),
};

export { apiClient };
export default api;
