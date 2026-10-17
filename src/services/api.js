// ==================== API CLIENT ====================
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
// Har request me token add karo
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('udaan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
// 401 aaye toh logout kar do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('udaan_token');
      localStorage.removeItem('udaan_company');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ==================== AUTH APIs ====================
export const authAPI = {
  companyLogin: (data) => api.post('/auth/company-admin/login', data),
  getMe: () => api.get('/auth/me'),
};

// ==================== COMPANY APIs ====================
export const companyAPI = {
  getProfile: () => api.get('/company/profile'),
  updateProfile: (data) => api.put('/company/profile', data),
  getDashboard: () => api.get('/company/dashboard'),
  getSubscription: () => api.get('/company/subscription'),

  // Users
  getUsers: () => api.get('/company/users'),
  createUser: (data) => api.post('/company/users', data),
  updateUser: (id, data) => api.put(`/company/users/${id}`, data),
  deleteUser: (id) => api.delete(`/company/users/${id}`),
  toggleBlock: (id) => api.put(`/company/users/${id}/block`),
  getUsersStats: () => api.get('/company/users/stats'),
  getSalesmen: () => api.get('/company/users/salesmen'),
  getDistributors: () => api.get('/company/users/distributors'),
  resetPassword: (id, newPassword) =>
    api.post(`/company/users/${id}/reset-password`, { newPassword }),
};

// ==================== PRODUCT APIs ====================
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  getOne: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getLowStock: (threshold) =>
    api.get('/products/low-stock', { params: { threshold } }),
  search: (q) => api.get('/products/search', { params: { q } }),
};

// ==================== STOCK APIs ====================
export const stockAPI = {
  getAll: (params) => api.get('/stock', { params }),
  getStats: () => api.get('/stock/stats'),
  stockIn: (data) => api.post('/stock/in', data),
  stockOut: (data) => api.post('/stock/out', data),
  getMovements: (params) => api.get('/stock/movements', { params }),
  getLowAlerts: () => api.get('/stock/low-alerts'),
  getProductStock: (productId) => api.get(`/stock/product/${productId}`),
};

// ==================== ORDER APIs ====================
export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  create: (data) => api.post('/orders', data),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
  getByRetailer: (id) => api.get(`/orders/retailer/${id}`),
  getBySalesman: (id) => api.get(`/orders/salesman/${id}`),
};

// ==================== RETAILER APIs ====================
export const retailerAPI = {
  getAll: (params) => api.get('/retailers', { params }),
  create: (data) => api.post('/retailers', data),
  bulkInsert: (retailers) => api.post('/retailers/bulk', { retailers }),
  getOne: (id) => api.get(`/retailers/${id}`),
  update: (id, data) => api.put(`/retailers/${id}`, data),
  delete: (id) => api.delete(`/retailers/${id}`),
  getStats: () => api.get('/retailers/stats'),
};

// ==================== PAYMENT APIs ====================
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  getStatus: (orderId) => api.get(`/payment/status/${orderId}`),
  getHistory: () => api.get('/payment/history'),
};

// ==================== RE-EXPORT SERVICES ====================
// Ye services alag files me hain (clean code ke liye)
import { authService } from './auth.service';
import { companyService } from './company.service';
import { productService } from './product.service';
import { stockService } from './stock.service';
import { orderService } from './order.service';
import { distributorService } from './distributor.service';
import { salesmanService } from './salesman.service';
import { reportService } from './report.service';

export {
  authService,
  companyService,
  productService,
  stockService,
  orderService,
  distributorService,
  salesmanService,
  reportService,
};