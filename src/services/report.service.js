// ==================== REPORT SERVICE ====================
import api from './api';

export const reportService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: () => api.get('/company/dashboard'),

  // ==================== ORDER REPORTS ====================
  getOrderStats: () => api.get('/orders/stats'),

  getOrdersByStatus: async (status) => {
    const res = await api.get('/orders', { params: { status } });
    return res;
  },

  // ==================== STOCK REPORTS ====================
  getStockStats: () => api.get('/stock/stats'),
  getLowStockAlerts: () => api.get('/stock/low-alerts'),
  getMovements: (params) => api.get('/stock/movements', { params }),

  // ==================== PRODUCT REPORTS ====================
  getProductStats: async () => {
    const res = await api.get('/products');
    const products = res.data.data || [];

    const byCategory = {};
    products.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });

    return {
      data: {
        success: true,
        data: {
          total: products.length,
          byCategory,
          lowStock: products.filter((p) => p.stock < 50).length,
          outOfStock: products.filter((p) => p.stock === 0).length,
        },
      },
    };
  },

  // ==================== USER REPORTS ====================
  getUserStats: () => api.get('/company/users/stats'),

  // ==================== RETAILER REPORTS ====================
  getRetailerStats: () => api.get('/retailers/stats'),

  // ==================== COMBINED REPORT ====================
  getFullReport: async () => {
    const [dashboard, orderStats, stockStats, userStats] = await Promise.all([
      api.get('/company/dashboard'),
      api.get('/orders/stats'),
      api.get('/stock/stats'),
      api.get('/company/users/stats'),
    ]);

    return {
      data: {
        success: true,
        data: {
          dashboard: dashboard.data.data,
          orders: orderStats.data.data,
          stock: stockStats.data.data,
          users: userStats.data.data,
        },
      },
    };
  },

  // ==================== EXPORT ====================
  exportOrdersCSV: async () => {
    const res = await api.get('/orders');
    const orders = res.data.data || [];

    const headers = [
      'Order Number',
      'Product',
      'Retailer',
      'Quantity',
      'Amount',
      'Status',
      'Date',
    ];
    const rows = orders.map((o) => [
      o.order_number,
      o.product_name,
      o.retailer_name,
      o.quantity,
      o.amount,
      o.status,
      new Date(o.created_at).toLocaleDateString('en-IN'),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  },
};

export default reportService;