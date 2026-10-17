import React from 'react'; 
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
 
// ==================== NAV ITEMS ==================== 
const navItems = [ 
  { path: '/', label: 'Dashboard', icon: '📊' }, 
  { path: '/products', label: 'Products', icon: '📦' }, 
  { path: '/stock', label: 'Stock', icon: '🏭' }, 
  { path: '/orders', label: 'Orders', icon: '📋' }, 
  { path: '/salesmen', label: 'Salesmen', icon: '🧑‍💼' }, 
  { path: '/distributors', label: 'Distributors', icon: '🚚' }, 
  { path: '/schemes', label: 'Schemes', icon: '🎁' }, 
  { path: '/reports', label: 'Reports', icon: '📈' }, 
  { path: '/settings', label: 'Settings', icon: '⚙️' }, 
]; 
 
export default function Sidebar() { 
  const { company, logout } = useAuth(); 
  const navigate = useNavigate(); 
 
  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
  }; 
 
  // Subscription Project par redirect karne ke liye
  const handleUpgradePlan = () => {
    window.location.href = 'http://localhost:5173/'; 
  };

  // Make Website button click handler
  const handleMakeWebsite = () => {
    // Aap yahan apni website builder ki link ya route daal sakte hain
    alert('Make Website feature par abhi kaam chal raha hai!'); 
  };
 
  return ( 
    <aside className="w-64 bg-gradient-to-b from-marico-blue to-marico-blue-dark text-white flex flex-col shadow-xl min-h-screen"> 
      {/* ===== Logo ===== */} 
      <div className="p-5 border-b border-white/10"> 
        <h1 className="text-2xl font-black tracking-wider">UDAAN</h1> 
        <p className="text-xs text-blue-200 tracking-widest uppercase"> 
          Company Admin 
        </p> 
      </div> 
 
      {/* ===== Company Info ===== */} 
      <div className="px-4 py-3 border-b border-white/10"> 
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3"> 
          <div className="w-10 h-10 rounded-full bg-marico-green flex items-center justify-center font-bold text-white shrink-0"> 
            {company?.name?.charAt(0)?.toUpperCase() || 'C'} 
          </div> 
          <div className="min-w-0 flex-1"> 
            <p className="text-sm font-bold truncate"> 
              {company?.name || 'Company'} 
            </p> 
            <div className="flex items-center gap-1.5"> 
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> 
              <p className="text-[10px] text-blue-200"> 
                {company?.plan || 'Starter'} Plan 
              </p> 
            </div> 
          </div> 
        </div> 
      </div> 
 
      {/* ===== Navigation ===== */} 
      <nav className="flex-1 overflow-y-auto py-3"> 
        {navItems.map((item) => ( 
          <NavLink 
            key={item.path} 
            to={item.path} 
            end={item.path === '/'} 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${ 
                isActive 
                  ? 'bg-white/10 border-l-4 border-marico-green text-white' 
                  : 'hover:bg-white/5 border-l-4 border-transparent text-blue-100' 
              }` 
            } 
          > 
            <span className="text-lg">{item.icon}</span> 
            <span>{item.label}</span> 
          </NavLink> 
        ))} 
      </nav> 
 
      {/* ===== ACTION BUTTONS (UPGRADE & MAKE WEBSITE) ===== */}
      <div className="px-3 py-2 border-t border-white/10 space-y-2"> 
        <button 
          onClick={handleUpgradePlan} 
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer" 
        > 
          ⭐ UPGRADE YOUR PLAN 
        </button> 

        <button 
          onClick={handleMakeWebsite} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer" 
        > 
          🌐 Make your Website 
        </button>
      </div> 
 
      {/* ===== Logout ===== */} 
      <div className="border-t border-white/10 p-3"> 
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg font-medium text-sm transition-colors" 
        > 
          🚪 Logout 
        </button> 
        <p className="text-center text-[10px] text-blue-300 mt-3 font-mono"> 
          v1.0.0 
        </p> 
      </div> 
    </aside> 
  ); 
}