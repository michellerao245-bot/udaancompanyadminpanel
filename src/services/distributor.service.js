// ==================== DISTRIBUTOR SERVICE ====================
import api from './api';

export const distributorService = {
  // ==================== CRUD ====================
  getAll: (params) => api.get('/company/users/distributors', { params }),
  getOne: (id) => api.get(`/company/users/${id}`),

  create: (data) =>
    api.post('/company/users', { ...data, role: 'DISTRIBUTOR' }),

  update: (id, data) => api.put(`/company/users/${id}`, data),
  delete: (id) => api.delete(`/company/users/${id}`),

  // ==================== ACTIONS ====================
  toggleBlock: (id) => api.put(`/company/users/${id}/block`),
  resetPassword: (id, newPassword) =>
    api.post(`/company/users/${id}/reset-password`, { newPassword }),

  // ==================== STATS ====================
  getStats: async () => {
    const res = await api.get('/company/users/distributors');
    const distributors = res.data.data || [];

    const total = distributors.length;
    const active = distributors.filter((d) => d.status === 'ACTIVE').length;
    const blocked = distributors.filter((d) => d.status === 'BLOCKED').length;

    return {
      data: {
        success: true,
        data: { total, active, blocked },
      },
    };
  },
};

export default distributorService;