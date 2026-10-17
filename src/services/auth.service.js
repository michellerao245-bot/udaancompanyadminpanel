// ==================== AUTH SERVICE ====================
import api from './api';

export const authService = {
  // Company admin login
  login: (email, password) =>
    api.post('/auth/company-admin/login', { email, password }),

  // Get current user
  getMe: () => api.get('/auth/me'),

  // Logout (client side)
  logout: () => {
    localStorage.removeItem('udaan_token');
    localStorage.removeItem('udaan_company');
  },
};

export default authService;