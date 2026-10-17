import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { schemeService } from './services/scheme.service';

// Components
import Layout from './components/Layout';
import Login from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/ProductManagement';
import StockManagement from './pages/StockManagement';
import OrderManagement from './pages/OrderManagement';
import SalesmanManagement from './pages/SalesmanManagement';
import DistributorManagement from './pages/DistributorManagement';
import SchemeManagement from './pages/SchemeManagement';
import SalesReports from './pages/SalesReports';
import CompanySettings from './pages/CompanySettings';

// ==================== SCHEME PASSWORD MODAL ====================
const SchemePasswordModal = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!password || password.length !== 6) {
      setError('6-digit password daalo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await schemeService.verifySchemePassword(password);

      if (res.data.success && res.data.data.valid) {
        toast.success('✅ Access granted!');
        onSuccess();
      } else {
        setError('❌ Galat password! Access denied.');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Lock Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🔐</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-800 text-center mb-2">
          Scheme Access
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Ye password sirf authorized persons ke paas hai
        </p>

        {/* Password Input */}
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPassword(val);
              setError('');
            }}
            onKeyDown={handleKeyPress}
            placeholder="• • • • • •"
            maxLength={6}
            autoFocus
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-2xl font-mono tracking-[0.5em] focus:border-orange-500 outline-none"
          />
          <p className="text-[10px] text-gray-400 text-center mt-2">
            {password.length}/6 digits
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-red-700 text-center font-bold">
              {error}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || password.length !== 6}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            {loading ? '⏳ Verifying...' : '🔓 Unlock'}
          </button>
        </div>

        {/* Hint */}
        <p className="text-[10px] text-gray-400 text-center mt-4">
          💡 Password bhool gaye? Company Admin se contact karein
        </p>
      </div>
    </div>
  );
};

// ==================== PROTECTED SCHEME ROUTE ====================
const ProtectedSchemeRoute = ({ children }) => {
  const [verified, setVerified] = useState(false);

  if (!verified) {
    return (
      <SchemePasswordModal
        onSuccess={() => setVerified(true)}
        onCancel={() => window.history.back()}
      />
    );
  }

  return children;
};

// ==================== PROTECTED ROUTE ====================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// ==================== PUBLIC ROUTE ====================
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// ==================== APP ROUTES ====================
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="salesmen" element={<SalesmanManagement />} />
        <Route path="distributors" element={<DistributorManagement />} />

        {/* 🎁 SCHEMES — Password protected */}
        <Route
          path="schemes"
          element={
            <ProtectedSchemeRoute>
              <SchemeManagement />
            </ProtectedSchemeRoute>
          }
        />

        <Route path="reports" element={<SalesReports />} />
        <Route path="settings" element={<CompanySettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <AppRoutes />
      </CompanyProvider>
    </AuthProvider>
  );
}