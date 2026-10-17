// ==================== SALESMAN SERVICE ====================
import api from './api';

export const salesmanService = {
  // ==================== CRUD ====================
  getAll: (params) => api.get('/company/users/salesmen', { params }),
  getOne: (id) => api.get(`/company/users/${id}`),

  create: (data) =>
    api.post('/company/users', { ...data, role: 'SALESMAN' }),

  update: (id, data) => api.put(`/company/users/${id}`, data),
  delete: (id) => api.delete(`/company/users/${id}`),

  // ==================== ACTIONS ====================
  toggleBlock: (id) => api.put(`/company/users/${id}/block`),
  resetPassword: (id, newPassword) =>
    api.post(`/company/users/${id}/reset-password`, { newPassword }),

  // ==================== STATS ====================
  getStats: async () => {
    const res = await api.get('/company/users/salesmen');
    const salesmen = res.data.data || [];

    const total = salesmen.length;
    const active = salesmen.filter((s) => s.status === 'ACTIVE').length;
    const blocked = salesmen.filter((s) => s.status === 'BLOCKED').length;

    return {
      data: {
        success: true,
        data: { total, active, blocked },
      },
    };
  },

  // ==================== ORDERS ====================
  getOrders: (salesmanId) =>
    api.get(`/orders/salesman/${salesmanId}`),
};

export default salesmanService;