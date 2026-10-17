import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#1c4f9c', '#6cbd45', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportCharts({ orders, products }) {
  // Chart 1: Orders by status
  const statusData = React.useMemo(() => {
    if (!orders) return [];
    const counts = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [orders]);

  // Chart 2: Top 5 products by orders
  const topProducts = React.useMemo(() => {
    if (!orders) return [];
    const productSales = {};
    orders.forEach((o) => {
      if (!productSales[o.product_name]) {
        productSales[o.product_name] = 0;
      }
      productSales[o.product_name] += Number(o.amount || 0);
    });
    return Object.entries(productSales)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [orders]);

  // Chart 3: Products by category
  const categoryData = React.useMemo(() => {
    if (!products) return [];
    const catCount = {};
    products.forEach((p) => {
      catCount[p.category] = (catCount[p.category] || 0) + 1;
    });
    return Object.entries(catCount).map(([category, count]) => ({
      category,
      count,
    }));
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Orders by Status */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">
          📊 Orders by Status
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="status" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1c4f9c" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">
          🏆 Top 5 Products (Revenue)
        </h3>
        {topProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">
            No order data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6cbd45"
                strokeWidth={3}
                dot={{ fill: '#6cbd45', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Products by Category */}
      <div className="bg-white rounded-2xl shadow-sm p-5 lg:col-span-2">
        <h3 className="text-sm font-bold text-gray-800 mb-4">
          📦 Products by Category
        </h3>
        {categoryData.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">
            No product data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.category}: ${entry.count}`}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}