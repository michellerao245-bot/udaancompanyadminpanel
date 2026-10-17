import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { schemeService } from '../services/scheme.service';
import { productService } from '../services/product.service';

export default function AddScheme({ states, editScheme, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: editScheme?.title || '',
    description: editScheme?.description || '',
    scheme_type: editScheme?.scheme_type || 'PRODUCT',
    state_code: editScheme?.state_code || '',
    target_product_id: editScheme?.target_product_id || '',
    target_category: editScheme?.target_category || '',
    target_amount: editScheme?.target_amount || '',
    offer_type: editScheme?.offer_type || 'BOGO',
    offer_value: editScheme?.offer_value || '',
    offer_description: editScheme?.offer_description || '',
    reward_points: editScheme?.reward_points || '',
    reward_cashback: editScheme?.reward_cashback || '',
    valid_from: editScheme?.valid_from || '',
    valid_to: editScheme?.valid_to || '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getAll();
      if (res.data.success) setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Group states by region
  const groupedStates = () => {
    const groups = {};
    states.forEach((s) => {
      const region = s.region || 'Other';
      if (!groups[region]) groups[region] = [];
      groups[region].push(s);
    });
    return groups;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error('Title zaroori hai');
    if (!form.state_code) return toast.error('State select karo');
    if (!form.valid_from || !form.valid_to) return toast.error('Valid dates zaroori hain');

    setLoading(true);
    try {
      if (editScheme) {
        await schemeService.update(editScheme.id, form);
        toast.success('Scheme updated');
      } else {
        await schemeService.create(form);
        toast.success('Scheme created');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-800">
            {editScheme ? '✏️ Edit Scheme' : '➕ Add Scheme'}
          </h2>
          <p className="text-sm text-gray-500">Create state-wise scheme</p>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-bold"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-black text-gray-700 uppercase">📝 Basic Info</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Diwali Dhamaka 2026"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Scheme ka short description..."
              rows="2"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none resize-none"
            />
          </div>

          {/* STATE DROPDOWN — 22 STATES */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              📍 State * (Total: {states.length})
            </label>
            <select
              value={form.state_code}
              onChange={(e) => setForm({ ...form, state_code: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none bg-white font-bold"
            >
              <option value="">-- Select State ({states.length} states) --</option>
              {Object.entries(groupedStates()).map(([region, regionStates]) => (
                <optgroup key={region} label={`📍 ${region}`}>
                  {regionStates.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {form.state_code && (
              <p className="text-[10px] text-green-600 font-bold mt-1">
                ✅ Selected: {states.find((s) => s.code === form.state_code)?.name}
              </p>
            )}
          </div>
        </div>

        {/* SCHEME DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-black text-gray-700 uppercase">🎁 Scheme Details</h3>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Scheme Type</label>
            <select
              value={form.scheme_type}
              onChange={(e) => setForm({ ...form, scheme_type: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none bg-white"
            >
              <option value="PRODUCT">Product-wise</option>
              <option value="CATEGORY">Category-wise</option>
              <option value="ORDER">Order-wise</option>
            </select>
          </div>

          {form.scheme_type === 'PRODUCT' && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Product *</label>
              <select
                value={form.target_product_id}
                onChange={(e) => setForm({ ...form, target_product_id: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none bg-white"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          )}

          {form.scheme_type === 'CATEGORY' && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category *</label>
              <input
                type="text"
                value={form.target_category}
                onChange={(e) => setForm({ ...form, target_category: e.target.value })}
                placeholder="e.g. SAFFOLA OIL"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none uppercase"
              />
            </div>
          )}

          {form.scheme_type === 'ORDER' && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={form.target_amount}
                onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                placeholder="e.g. 5000"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Offer Type</label>
              <select
                value={form.offer_type}
                onChange={(e) => setForm({ ...form, offer_type: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none bg-white"
              >
                <option value="BOGO">Buy X Get Y Free</option>
                <option value="DISCOUNT_PERCENT">Discount %</option>
                <option value="DISCOUNT_FLAT">Flat Discount</option>
                <option value="FREE_ITEM">Free Item</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Value *</label>
              <input
                type="number"
                value={form.offer_value}
                onChange={(e) => setForm({ ...form, offer_value: e.target.value })}
                placeholder="e.g. 10"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Offer Description</label>
            <input
              type="text"
              value={form.offer_description}
              onChange={(e) => setForm({ ...form, offer_description: e.target.value })}
              placeholder="e.g. Buy 10 Get 1 Free"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
            />
          </div>
        </div>

        {/* REWARDS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-black text-gray-700 uppercase">🏆 Rewards (Optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reward Points</label>
              <input
                type="number"
                value={form.reward_points}
                onChange={(e) => setForm({ ...form, reward_points: e.target.value })}
                placeholder="e.g. 500"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cashback (₹)</label>
              <input
                type="number"
                value={form.reward_cashback}
                onChange={(e) => setForm({ ...form, reward_cashback: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
          </div>
        </div>

        {/* VALIDITY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="text-sm font-black text-gray-700 uppercase">📅 Validity</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Valid From *</label>
              <input
                type="date"
                value={form.valid_from}
                onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Valid To *</label>
              <input
                type="date"
                value={form.valid_to}
                onChange={(e) => setForm({ ...form, valid_to: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#1c4f9c] outline-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1c4f9c] hover:bg-[#0e3d7a] disabled:opacity-60 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 uppercase tracking-wide"
          >
            {loading ? '⏳ Saving...' : editScheme ? '✅ Update' : '➕ Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}