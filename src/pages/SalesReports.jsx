import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { orderAPI, productAPI } from '../services/api';
import ReportCharts from '../components/ReportCharts';

export default function SalesReports() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordRes, prodRes] = await Promise.all([
        orderAPI.getAll({ limit: 500 }),
        productAPI.getAll(),
      ]);
      if (ordRes.data.success) setOrders(ordRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">📈 Sales Reports</h2>
        <p className="text-sm text-gray-500">
          Analytics and insights for your business
        </p>
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-400">Loading...</p>
      ) : (
        <ReportCharts orders={orders} products={products} />
      )}
    </div>
  );
}