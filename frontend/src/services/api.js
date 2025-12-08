import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
  getAll: () => api.get('/menu'),
  getActive: () => api.get('/menu/active'),
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
};

export const categoryService = {
  getAll: () => api.get('/categories'),
};

export const analyticsService = {
  getSales: (range) => api.get(`/analytics/sales?range=${range}`),
  getTopItems: (range) => api.get(`/analytics/top-items?range=${range}`),
  getInventoryUsage: (range) => api.get(`/analytics/inventory-usage?range=${range}`),
  getStaffPerformance: (range) => api.get(`/analytics/staff-performance?range=${range}`),
};

export default api;
