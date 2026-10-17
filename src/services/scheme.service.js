// ==================== SCHEME SERVICE ====================
import api from './api';

export const schemeService = {
  // States
  getStates: () => api.get('/schemes/states'),

  // Schemes CRUD
  getAll: (params) => api.get('/schemes', { params }),
  getOne: (id) => api.get(`/schemes/${id}`),
  create: (data) => api.post('/schemes', data),
  update: (id, data) => api.put(`/schemes/${id}`, data),
  delete: (id) => api.delete(`/schemes/${id}`),
  getStats: () => api.get('/schemes/stats'),

  // 🎁 SCHEME PASSWORD
  getSchemePassword: () => api.get('/company/scheme-password'),
  setSchemePassword: (password) =>
    api.post('/company/scheme-password/set', { password }),
  verifySchemePassword: (password) =>
    api.post('/company/scheme-password/verify', { password }),
};

export default schemeService;