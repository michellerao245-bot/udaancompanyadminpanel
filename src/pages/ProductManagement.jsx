import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productAPI } from '../services/api';
import ProductTable from '../components/ProductTable';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    mrp: '',
    rate: '',
    unit: 'PCH',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll();
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await productAPI.update(editProduct.id, form);
        toast.success('Product updated');
      } else {
        await productAPI.create(form);
        toast.success('Product added');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      mrp: product.mrp,
      rate: product.rate,
      unit: product.unit,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await productAPI.delete(product.id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm({
      name: '',
      category: '',
      mrp: '',
      rate: '',
      unit: 'PCH',
      stock: '',
    });
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">📦 Products</h2>
          <p className="text-sm text-gray-500">
            Total: {products.length} products
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-marico-blue hover:bg-marico-blue-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all active:scale-95"
        >
          ➕ Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search products..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-marico-blue outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        {loading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : (
          <ProductTable
            products={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editProduct ? '✏️ Edit Product' : '➕ Add Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                  placeholder="e.g. SAFFOLA OIL"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
                  >
                    <option value="PCH">PCH (Pouch)</option>
                    <option value="BT">BT (Bottle)</option>
                    <option value="JAR">JAR</option>
                    <option value="BOX">BOX</option>
                    <option value="KG">KG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marico-blue outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-marico-green hover:bg-marico-green-dark text-white font-bold py-3 rounded-xl transition-all"
                >
                  ✅ Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}