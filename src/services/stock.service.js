// ==================== STOCK SERVICE ====================
import api from './api';

export const stockService = {
  // ==================== STOCK CRUD ====================
  getAll: (params) => api.get('/stock', { params }),
  getStats: () => api.get('/stock/stats'),

  // ==================== STOCK IN/OUT ====================
  stockIn: (data) => api.post('/stock/in', data),
  stockOut: (data) => api.post('/stock/out', data),

  // ==================== MOVEMENTS ====================
  getMovements: (params) => api.get('/stock/movements', { params }),

  // ==================== ALERTS ====================
  getLowAlerts: () => api.get('/stock/low-alerts'),

  // ==================== PRODUCT STOCK ====================
  getProductStock: (productId) =>
    api.get(`/stock/product/${productId}`),
};

export default stockService;