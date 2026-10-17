import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCompany } from '../context/CompanyContext';
import { schemeService } from '../services/scheme.service';

export default function CompanySettings() {
  const { profile, subscription, updateProfile } = useCompany();

  // ==================== PROFILE FORM ====================
  const [form, setForm] = useState({
    name: profile?.name || '',
    owner_name: profile?.owner_name || '',
    gst_number: profile?.gst_number || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
  });

  // ==================== 🎁 SCHEME PASSWORD STATE ====================
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(true);

  // ==================== FETCH SCHEME PASSWORD ====================
  useEffect(() => {
    fetchSchemePassword();
  }, []);

  const fetchSchemePassword = async () => {
    try {
      const res = await schemeService.getSchemePassword();
      if (res.data.success) {
        setCurrentPassword(res.data.data.scheme_password || '123456');
      }
    } catch (err) {
      console.error('Fetch scheme password error:', err);
    } finally {
      setLoadingPassword(false);
    }
  };

  // ==================== SAVE PROFILE ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(form);
    if (res.success) toast.success('Profile updated');
    else toast.error(res.error || 'Failed');
  };

  // ==================== 🎁 UPDATE SCHEME PASSWORD ====================
  const handleUpdatePassword = async () => {
    // Validation
    if (!newPassword || newPassword.length !== 6 || !/^\d+$/.test(newPassword)) {
      toast.error('Password 6-digit numbers ka hona chahiye');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password match nahi kar raha');
      return;
    }

    if (newPassword === currentPassword) {
      toast.error('Naya password purane se alag hona chahiye');
      return;
    }

    setSavingPassword(true);
    try {
      await schemeService.setSchemePassword(newPassword);
      toast.success('Scheme password updated! ✅');
      setCurrentPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* ==================== HEADER ==================== */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">⚙️ Company Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your company profile and subscription
        </p>
      </div>

      {/* ==================== SUBSCRIPTION CARD ==================== */}
      {subscription && (
        <div className="bg-gradient-to-r from-[#1c4f9c] to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase opacity-80">Current Plan</p>
              <p className="text-3xl font-black mt-1">
                {subscription.plan_name || 'Starter'}
              </p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              {subscription.subscription_status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs opacity-80">Max Users</p>
              <p className="text-lg font-bold">{subscription.max_users}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Max Products</p>
              <p className="text-lg font-bold">{subscription.max_products}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Expires</p>
              <p className="text-sm font-bold">
                {new Date(subscription.subscription_end).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 🎁 SCHEME PASSWORD SECTION ==================== */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md shrink-0">
            <span className="text-2xl">🔐</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base">
              Scheme Access Password
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Ye password sirf wahi log jaante hain jinko scheme add/edit karne
              ki authority hai
            </p>
          </div>
        </div>

        {loadingPassword ? (
          <p className="text-center py-4 text-gray-400 text-sm">
            Loading...
          </p>
        ) : (
          <div className="space-y-4">
            {/* Current Password Display */}
            <div className="bg-white rounded-xl p-4 border-2 border-orange-200">
              <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">
                Current Password
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-2xl font-black text-gray-800 tracking-widest font-mono">
                  {showPassword ? currentPassword : '••••••'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-orange-600 hover:text-orange-700 transition-colors p-2"
                >
                  {showPassword ? (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Update Password Form */}
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200 space-y-3">
              <p className="text-[10px] font-bold text-gray-600 uppercase">
                Update Password
              </p>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  New Password (6 digits)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewPassword(val);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-mono tracking-widest text-center focus:border-orange-500 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {newPassword.length}/6
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setConfirmPassword(val);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-mono tracking-widest text-center focus:border-orange-500 outline-none"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[10px] text-red-500 mt-1">
                    ❌ Passwords match nahi kar rahe
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-[10px] text-green-600 mt-1">
                    ✅ Passwords match kar rahe hain
                  </p>
                )}
              </div>

              {/* Update Button */}
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={
                  savingPassword ||
                  newPassword.length !== 6 ||
                  newPassword !== confirmPassword
                }
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                {savingPassword ? '⏳ Updating...' : '🔐 Update Password'}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-3">
              <p className="text-xs text-yellow-800 font-medium">
                ⚠️ <strong>Important:</strong> Ye password scheme add/edit
                karne ke liye chahiye. Sirf authorized persons ko hi share
                karein.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== PROFILE FORM ==================== */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">📝 Company Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={form.owner_name}
                onChange={(e) =>
                  setForm({ ...form, owner_name: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={form.gst_number}
                onChange={(e) =>
                  setForm({ ...form, gst_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows="2"
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1c4f9c] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#1c4f9c] hover:bg-[#0e3d7a] text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}