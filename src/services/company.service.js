// ==================== COMPANY SERVICE ====================
import api from './api';

export const companyService = {
  // ==================== PROFILE ====================
  getProfile: () => api.get('/company/profile'),
  updateProfile: (data) => api.put('/company/profile', data),

  // ==================== DASHBOARD ====================
  getDashboard: () => api.get('/company/dashboard'),

  // ==================== SUBSCRIPTION ====================
  getSubscription: () => api.get('/company/subscription'),

  // ==================== USERS (Generic) ====================
  getUsers: (params) => api.get('/company/users', { params }),
  createUser: (data) => api.post('/company/users', data),
  updateUser: (id, data) => api.put(`/company/users/${id}`, data),
  deleteUser: (id) => api.delete(`/company/users/${id}`),
  toggleBlock: (id) => api.put(`/company/users/${id}/block`),
  resetPassword: (id, newPassword) =>
    api.post(`/company/users/${id}/reset-password`, { newPassword }),

  // ==================== USER STATS ====================
  getUserStats: () => api.get('/company/users/stats'),

  // ==================== FILTERED USERS ====================
  getSalesmen: () => api.get('/company/users/salesmen'),
  getDistributors: () => api.get('/company/users/distributors'),
};

export default companyService;