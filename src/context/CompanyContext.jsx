import React, { createContext, useContext, useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================== LOAD DATA ====================
  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchDashboard(), fetchSubscription()]);
    } catch (err) {
      console.error('Failed to fetch company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await companyAPI.getProfile();
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await companyAPI.getDashboard();
      if (res.data.success) {
        setDashboard(res.data.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await companyAPI.getSubscription();
      if (res.data.success) {
        setSubscription(res.data.data);
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
    }
  };

  // ==================== UPDATE PROFILE ====================
  const updateProfile = async (data) => {
    try {
      const res = await companyAPI.updateProfile(data);
      if (res.data.success) {
        setProfile(res.data.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const value = {
    profile,
    dashboard,
    subscription,
    loading,
    fetchProfile,
    fetchDashboard,
    fetchSubscription,
    fetchAll,
    updateProfile,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used inside CompanyProvider');
  }
  return context;
};