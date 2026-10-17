// ==================== PRODUCT SERVICE ====================
import api from './api';

export const productService = {
  // ==================== CRUD ====================
  getAll: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  getOne: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),

  // ==================== FILTERS ====================
  getCategories: () => api.get('/products/categories'),
  getLowStock: (threshold = 50) =>
    api.get('/products/low-stock', { params: { threshold } }),
  search: (q) => api.get('/products/search', { params: { q } }),

  // ==================== STATS ====================
  getStats: async () => {
    const res = await api.get('/products');
    const products = res.data.data || [];

    const total = products.length;
    const lowStock = products.filter((p) => p.stock < 50).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const categories = [...new Set(products.map((p) => p.category))].length;

    return {
      data: {
        success: true,
        data: { total, lowStock, outOfStock, categories },
      },
    };
  },
};

export default productService;