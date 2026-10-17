import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-marico-blue via-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-marico-blue tracking-wider">
            UDAAN FAST TRACK 
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
            Company Admin Panel
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your company account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="company@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marico-blue focus:border-transparent outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-marico-blue focus:border-transparent outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-marico-blue to-marico-blue-dark hover:opacity-90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
          >
            {loading ? 'Signing In...' : '🔐 Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">
            Demo Credentials
          </p>
          <p className="text-xs text-blue-800 font-mono">
            marico@test.com / marico123
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Udaan Fast Track. All rights reserved.
        </p>
      </div>
    </div>
  );
}