import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';

const titles = {
  '/': 'Dashboard',
  '/products': 'Products Management',
  '/stock': 'Stock Management',
  '/orders': 'Orders Management',
  '/salesmen': 'Salesmen Management',
  '/distributors': 'Distributors Management',
  '/reports': 'Sales Reports',
  '/settings': 'Company Settings',
};

export default function Header() {
  const location = useLocation();
  const { subscription } = useCompany();

  const title = titles[location.pathname] || 'Dashboard';

  // Days left in subscription
  const daysLeft = subscription?.subscription_end
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.subscription_end) - new Date()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{today}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Subscription Badge */}
          {subscription?.subscription_status === 'ACTIVE' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-700 font-medium">
                {subscription.plan_name} • {daysLeft} days left
              </span>
            </div>
          )}

          {/* Notification */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}