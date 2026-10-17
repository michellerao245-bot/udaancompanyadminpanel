import React, { useEffect, useState } from 'react';
import { companyAPI, productAPI, orderAPI } from '../services/api';
import StatsCards from '../components/StatsCards';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, ordersRes, stockRes] = await Promise.all([
        companyAPI.getDashboard(),
        orderAPI.getAll({ limit: 5 }),
        productAPI.getLowStock(50),
      ]);

      if (dashRes.data.success) setStats(dashRes.data.data);
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data);
      if (stockRes.data.success) setLowStock(stockRes.data.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-marico-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-marico-blue to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-black">👋 Welcome Back!</h2>
        <p className="text-sm opacity-90 mt-1">
          Here's what's happening in your business today
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickAction to="/products" icon="➕" label="Add Product" />
        <QuickAction to="/salesmen" icon="👤" label="Add Salesman" />
        <QuickAction to="/stock" icon="📊" label="Stock IN/OUT" />
        <QuickAction to="/reports" icon="📈" label="View Reports" />
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">📋 Recent Orders</h3>
            <Link to="/orders" className="text-xs text-marico-blue font-medium">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              No orders yet
            </p>
          ) : (
            <div className="space-y-2">
              {recentOrders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {o.product_name}
                    </p>
                    <p className="text-xs text-gray-500">{o.retailer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-marico-blue">
                      ₹{Number(o.amount).toFixed(0)}
                    </p>
                    <p className="text-[10px] text-gray-400">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">⚠️ Low Stock Alert</h3>
            <Link to="/products" className="text-xs text-marico-blue font-medium">
              Manage →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              ✅ All products are well stocked
            </p>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {p.name}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.stock === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const QuickAction = ({ to, icon, label }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md hover:scale-105 transition-all text-center border border-gray-100"
  >
    <div className="text-3xl mb-1">{icon}</div>
    <p className="text-xs font-medium text-gray-700">{label}</p>
  </Link>
);