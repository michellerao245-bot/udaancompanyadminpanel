import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    const token = localStorage.getItem('udaan_token');
    const savedCompany = localStorage.getItem('udaan_company');

    if (token && savedCompany) {
      try {
        setCompany(JSON.parse(savedCompany));
        setUser({ type: 'company-admin' });
      } catch (err) {
        console.error('Failed to load auth:', err);
        localStorage.removeItem('udaan_token');
        localStorage.removeItem('udaan_company');
      }
    }

    setLoading(false);
  }, []);

  // ==================== LOGIN ====================
  const login = async (email, password) => {
    try {
      const response = await authAPI.companyLogin({ email, password });

      if (response.data.success) {
        const { token, company: companyData } = response.data.data;

        // Save
        localStorage.setItem('udaan_token', token);
        localStorage.setItem('udaan_company', JSON.stringify(companyData));

        setUser({ type: 'company-admin' });
        setCompany(companyData);

        toast.success(`Welcome back, ${companyData.name}!`);
        return { success: true };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    localStorage.removeItem('udaan_token');
    localStorage.removeItem('udaan_company');
    setUser(null);
    setCompany(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    company,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};