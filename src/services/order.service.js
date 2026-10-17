// ==================== ORDER SERVICE ====================
import api from './api';

export const orderService = {
  // ==================== CRUD ====================
  getAll: (params) => api.get('/orders', { params }),
  create: (data) => api.post('/orders', data),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),

  // ==================== STATS ====================
  getStats: () => api.get('/orders/stats'),

  // ==================== FILTERS ====================
  getByRetailer: (retailerId) =>
    api.get(`/orders/retailer/${retailerId}`),
  getBySalesman: (salesmanId) =>
    api.get(`/orders/salesman/${salesmanId}`),

  // ==================== BULK UPDATE ====================
  bulkUpdateStatus: async (orderIds, status) => {
    const results = await Promise.all(
      orderIds.map((id) => api.put(`/orders/${id}/status`, { status }))
    );
    return { success: true, data: results };
  },
};

export default orderService;