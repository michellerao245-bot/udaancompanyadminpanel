import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { schemeService } from '../services/scheme.service';
import AddScheme from './AddScheme';

export default function SchemeManagement() {
  const [schemes, setSchemes] = useState([]);
  const [states, setStates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editScheme, setEditScheme] = useState(null);
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [schemesRes, statesRes, statsRes] = await Promise.all([
        schemeService.getAll(),
        schemeService.getStates(),
        schemeService.getStats(),
      ]);
      if (schemesRes.data.success) setSchemes(schemesRes.data.data || []);
      if (statesRes.data.success) setStates(statesRes.data.data || []);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scheme?')) return;
    try {
      await schemeService.delete(id);
      toast.success('Scheme deleted');
      fetchAll();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleToggleStatus = async (scheme) => {
    const newStatus = scheme.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await schemeService.update(scheme.id, { status: newStatus });
      toast.success(`Scheme ${newStatus.toLowerCase()}`);
      fetchAll();
    } catch (err) {
      toast.error('Failed');
    }
  };

  const filtered = schemes.filter((s) => {
    if (stateFilter !== 'ALL' && s.state_code !== stateFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (showForm) {
    return (
      <AddScheme
        states={states}
        editScheme={editScheme}
        onClose={() => {
          setShowForm(false);
          setEditScheme(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setEditScheme(null);
          fetchAll();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-800">🎁 Schemes</h2>
          <p className="text-sm text-gray-500">Manage state-wise schemes & rewards</p>
        </div>
        <button
          onClick={() => {
            setEditScheme(null);
            setShowForm(true);
          }}
          className="bg-[#1c4f9c] hover:bg-[#0e3d7a] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          ➕ Add Scheme
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="🎁" label="Total" value={stats.total} gradient="from-blue-500 to-indigo-600" />
          <StatCard icon="✅" label="Active" value={stats.active} gradient="from-green-500 to-emerald-600" />
          <StatCard icon="⏸️" label="Paused" value={stats.paused} gradient="from-yellow-500 to-orange-600" />
          <StatCard icon="⌛" label="Expired" value={stats.expired} gradient="from-red-500 to-pink-600" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search schemes..."
          className="flex-1 min-w-[200px] px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1c4f9c] outline-none"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1c4f9c] outline-none bg-white"
        >
          <option value="ALL">All States</option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1c4f9c] outline-none bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1c4f9c] border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-6xl mb-4">🎁</p>
          <p className="text-lg font-bold text-gray-700">No schemes found</p>
          <p className="text-sm text-gray-500 mt-1">Create your first scheme to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-[#1c4f9c] text-white px-5 py-2.5 rounded-xl font-bold"
          >
            ➕ Add First Scheme
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-md border-2 border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-black text-gray-800 uppercase leading-tight">{s.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{s.description || 'No description'}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                  s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  📍 {s.states?.name || s.state_code}
                </span>
                <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  🎁 {s.scheme_type}
                </span>
                <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                  💰 {s.offer_type}: {s.offer_value}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[9px] text-gray-500 font-bold uppercase">From</p>
                  <p className="text-xs font-black">{new Date(s.valid_from).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-[9px] text-gray-500 font-bold uppercase">To</p>
                  <p className="text-xs font-black">{new Date(s.valid_to).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleToggleStatus(s)}
                  className="flex-1 text-xs font-bold py-2 rounded-lg bg-yellow-100 text-yellow-700"
                >
                  {s.status === 'ACTIVE' ? '⏸️ Pause' : '▶️ Activate'}
                </button>
                <button
                  onClick={() => { setEditScheme(s); setShowForm(true); }}
                  className="flex-1 text-xs font-bold py-2 rounded-lg bg-blue-100 text-blue-700"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-xs font-bold py-2 px-3 rounded-lg bg-red-100 text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}>
    <div className="absolute top-0 right-0 text-5xl opacity-20 -mr-2 -mt-2">{icon}</div>
    <div className="relative">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-bold uppercase opacity-90 mt-1">{label}</p>
    </div>
  </div>
);