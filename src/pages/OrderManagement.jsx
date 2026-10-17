import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderAPI } from '../services/api';
import OrderTable from '../components/OrderTable';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const res = await orderAPI.getAll(params);
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await orderAPI.getStats();
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success(`Order ${status.toLowerCase()}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const filters = ['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">📋 Orders</h2>
        <p className="text-sm text-gray-500">
          Manage all orders from salesmen
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={stats.total} color="blue" />
          <StatCard label="Pending" value={stats.pending} color="yellow" />
          <StatCard label="Delivered" value={stats.delivered} color="green" />
          <StatCard
            label="Revenue"
            value={`₹${stats.totalRevenue?.toLocaleString('en-IN') || 0}`}
            color="purple"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-3 flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-marico-blue text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        {loading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : (
          <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        )}
      </div>
    </div>
  );
}

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-indigo-600',
    yellow: 'from-yellow-500 to-orange-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
  };
  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white shadow-md`}
    >
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold uppercase opacity-90 mt-0.5">
        {label}
      </p>
    </div>
  );
};