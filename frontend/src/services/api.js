import axios from 'axios';

const isProduction = import.meta.env.PROD;
const developmentApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const API_BASE_URL =
  isProduction
    ? '/api'
    : developmentApiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const noCacheConfig = {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.includes('/auth/login');
    const hasToken = !!localStorage.getItem('token');

    // Keep users on login screen for bad credentials and avoid forced logout loops.
    if (error.response?.status === 401 && hasToken && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Give a formatted and fallback error message for consistent handling
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // Server responded with an error status
      const { status, data } = error.response;
      if (data && data.message) {
         errorMessage = data.message;
      } else if (typeof data === 'string' && data.trim()) {
         errorMessage = data;
      } else if (status === 403) {
         errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 404) {
         errorMessage = 'The requested resource was not found.';
      } else if (status >= 500) {
         errorMessage = 'Server error. Please try again later.';
      } else if (status === 401 && isLoginRequest) {
         errorMessage = 'Invalid credentials. Please try again.';
      } else if (status === 401) {
         errorMessage = 'Your session has expired. Please log in again.';
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection to the server.';
    }

    // Consistently attach the message back to the error object so components can rely on error.response.data.message
    if (!error.response) {
      error.response = { data: { message: errorMessage } };
    } else if (!error.response.data) {
      error.response.data = { message: errorMessage };
    } else if (typeof error.response.data === 'string') {
      error.response.data = { message: errorMessage };
    } else if (!error.response.data.message) {
      error.response.data.message = errorMessage;
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
};

export const menuService = {
  getAll: () => api.get(`/menu?_ts=${Date.now()}`, noCacheConfig),
  getActive: () => api.get(`/menu/active?_ts=${Date.now()}`, noCacheConfig),
  getById: (id) => api.get(`/menu/${id}`),
  create: (item) => api.post('/menu', item),
  update: (id, item) => api.put(`/menu/${id}`, item),
  delete: (id) => api.delete(`/menu/${id}`),
};

export const orderService = {
  getAll: () => api.get('/orders'),
  getByStatus: (status) => api.get(`/orders/status/${status}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (order) => api.post('/orders', order),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  resetRevenue: () => api.post('/orders/reset-revenue'),
  deleteAll: () => api.delete('/orders'),
};

export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getOutOfStock: () => api.get('/inventory/out-of-stock'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (item) => api.post('/inventory', item),
  update: (id, item) => api.put(`/inventory/${id}`, item),
  addStock: (id, quantity) => api.post(`/inventory/${id}/add-stock`, { currentStock: quantity }),
  delete: (id) => api.delete(`/inventory/${id}`),
  getUsageHistory: () => api.get('/inventory/usage-history'),
  resetUsageHistory: () => api.delete('/inventory/usage-history/reset'),
};

export const categoryService = {
  getAll: () => api.get(`/categories?_ts=${Date.now()}`, noCacheConfig),
};

export const analyticsService = {
  getSales: (range) => api.get(`/analytics/sales?range=${range}`),
  getTopItems: (range) => api.get(`/analytics/top-items?range=${range}`),
  getInventoryUsage: (range) => api.get(`/analytics/inventory-usage?range=${range}`),
  getStaffPerformance: (range) => api.get(`/analytics/staff-performance?range=${range}`),
};

export default api;
