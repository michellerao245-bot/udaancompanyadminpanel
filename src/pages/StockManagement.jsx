import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { stockAPI, productAPI } from '../services/api';

export default function StockManagement() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [mode, setMode] = useState('IN');
  const [form, setForm] = useState({
    productId: '',
    quantity: '',
    reason: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockRes, prodRes, movRes] = await Promise.all([
        stockAPI.getAll(),
        productAPI.getAll(),
        stockAPI.getMovements({ limit: 10 }),
      ]);
      if (stockRes.data.success) setStock(stockRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (movRes.data.success) setMovements(movRes.data.data);
    } catch (err) {
      toast.error('Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = mode === 'IN' ? stockAPI.stockIn : stockAPI.stockOut;
      await api(form);
      toast.success(`Stock ${mode} successful`);
      setForm({ productId: '', quantity: '', reason: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">📊 Stock Management</h2>
        <p className="text-sm text-gray-500">
          Manage stock IN and OUT operations
        </p>
      </div>

      {/* Mode Toggle + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          {/* Mode Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('IN')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                mode === 'IN'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ⬇️ Stock IN
            </button>
            <button
              onClick={() => setMode('OUT')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                mode === 'OUT'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              ⬆️ Stock OUT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm({ ...form, productId: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                required
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder={mode === 'IN' ? 'C&F received' : 'Salesman order'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                mode === 'IN'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {mode === 'IN' ? '⬇️ Receive Stock' : '⬆️ Send Stock'}
            </button>
          </form>
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4">📜 Recent Movements</h3>
          {movements.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">
              No movements yet
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      m.type === 'IN' ? 'bg-green-100' : 'bg-orange-100'
                    }`}
                  >
                    {m.type === 'IN' ? '⬇️' : '⬆️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {m.product_name}
                    </p>
                    <p className="text-xs text-gray-500">{m.reason}</p>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      m.type === 'IN' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {m.type === 'IN' ? '+' : '-'}
                    {m.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">📦 Current Stock</h3>
        {loading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : stock.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">
            No stock records yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                    Received
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                    Sold
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                    Current
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stock.map((s) => {
                  const current = s.received - s.sold;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {s.product_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-green-600 font-bold">
                        {s.received}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-orange-600 font-bold">
                        {s.sold}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-black px-3 py-1 rounded-full ${
                            current <= 0
                              ? 'bg-red-100 text-red-700'
                              : current < 50
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {current}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}