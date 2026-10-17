import React from 'react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Products',
      value: stats?.products || 0,
      icon: '📦',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Total Orders',
      value: stats?.orders || 0,
      icon: '📋',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Salesmen',
      value: stats?.salesmen || 0,
      icon: '🧑‍💼',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: '💰',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 text-6xl opacity-20 -mr-2 -mt-2">
            {card.icon}
          </div>
          <div className="relative">
            <p className="text-3xl font-black">{card.value}</p>
            <p className="text-xs font-bold uppercase opacity-90 mt-1">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}