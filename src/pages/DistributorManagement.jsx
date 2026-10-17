import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { companyAPI } from '../services/api';
import DistributorTable from '../components/DistributorTable';

export default function DistributorManagement() {
  const [distributors, setDistributors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    userId: '',
    name: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    fetchDistributors();
  }, []);

  // ==================== FETCH ====================
  const fetchDistributors = async () => {
    try {
      const res = await companyAPI.getDistributors();
      if (res.data.success) setDistributors(res.data.data);
    } catch (err) {
      toast.error('Failed to load distributors');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==================== FRONTEND VALIDATION ====================

    // User ID
    if (!form.userId || form.userId.trim().length < 3) {
      toast.error('User ID minimum 3 characters ka hona chahiye');
      return;
    }

    // Name
    if (!form.name || form.name.trim().length < 2) {
      toast.error('Name minimum 2 characters ka hona chahiye');
      return;
    }

    // Phone (10 digits, 6-9 se start)
    if (form.phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(form.phone)) {
        toast.error('Phone number 10 digit ka hona chahiye (6-9 se start)');
        return;
      }
    }

    // Password
    if (!form.password || form.password.length < 6) {
      toast.error('Password minimum 6 characters ka hona chahiye');
      return;
    }

    // ==================== API CALL ====================
    try {
      await companyAPI.createUser({ ...form, role: 'DISTRIBUTOR' });
      toast.success('Distributor added successfully');
      setForm({ userId: '', name: '', phone: '', password: '' });
      setShowModal(false);
      fetchDistributors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add distributor');
    }
  };

  // ==================== BLOCK ====================
  const handleBlock = async (id) => {
    try {
      await companyAPI.toggleBlock(id);
      toast.success('Status updated');
      fetchDistributors();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  // ==================== DELETE ====================
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this distributor?')) return;
    try {
      await companyAPI.deleteUser(id);
      toast.success('Distributor deleted');
      fetchDistributors();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // ==================== RESET PASSWORD ====================
  const handleResetPassword = async (id) => {
    const newPassword = window.prompt('Enter new password (min 6 chars):');
    if (!newPassword) return;

    if (newPassword.length < 6) {
      toast.error('Password minimum 6 characters');
      return;
    }

    try {
      await companyAPI.resetPassword(id, newPassword);
      toast.success('Password reset successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset');
    }
  };

  // ==================== CLOSE MODAL ====================
  const closeModal = () => {
    setShowModal(false);
    setForm({ userId: '', name: '', phone: '', password: '' });
  };

  return (
    <div className="space-y-4">
      {/* ==================== HEADER ==================== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🚚 Distributors</h2>
          <p className="text-sm text-gray-500">
            Total: {distributors.length} distributors
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-marico-blue hover:bg-marico-blue-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all active:scale-95"
        >
          ➕ Add Distributor
        </button>
      </div>

      {/* ==================== TABLE ==================== */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        {loading ? (
          <p className="text-center py-8 text-gray-400">Loading...</p>
        ) : (
          <DistributorTable
            distributors={distributors}
            onBlock={handleBlock}
            onDelete={handleDelete}
            onResetPassword={handleResetPassword}
          />
        )}
      </div>

      {/* ==================== ADD MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ➕ Add Distributor
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* User ID */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  User ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DIST001"
                  value={form.userId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      userId: e.target.value.toUpperCase().trim(),
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-marico-blue outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Minimum 3 characters (e.g. DIST001)
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-marico-blue outline-none"
                />
              </div>

              {/* Phone with validation */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => {
                      // Sirf digits allow karo, max 10
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm({ ...form, phone: value });
                    }}
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    className="w-full pl-14 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-marico-blue outline-none"
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-gray-400">
                    10 digits (6-9 se start)
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      form.phone.length === 10
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {form.phone.length}/10
                  </p>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-marico-blue outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-marico-green hover:bg-marico-green-dark text-white font-bold py-3 rounded-xl transition-all"
                >
                  ✅ Create
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