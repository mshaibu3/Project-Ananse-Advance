import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LiveFeed from './components/LiveFeed';
import ViolationReview from './components/ViolationReview';
import Maintenance from './components/Maintenance';
import { LayoutDashboard, Camera, AlertTriangle, Settings, Bell, Zap, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'live' | 'violations' | 'maintenance'>('dashboard');
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200">
      {/* Sidebar */}
      <nav className="w-20 lg:w-64 border-r border-white/10 flex flex-col items-center lg:items-stretch bg-[#0d0d0d]">
        <div className="p-6 flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
            A
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-xl tracking-tighter text-white">ANANSE</h1>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">Neural Net Core</p>
          </div>
        </div>

        <div className="flex-1 mt-6 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Ananse Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Camera size={20} />} 
            label="Visual Nodes" 
            active={activeTab === 'live'} 
            onClick={() => setActiveTab('live')} 
          />
          <NavItem 
            icon={<AlertTriangle size={20} />} 
            label="Violation Queue" 
            active={activeTab === 'violations'} 
            onClick={() => setActiveTab('violations')} 
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Spider Health" 
            active={activeTab === 'maintenance'} 
            onClick={() => setActiveTab('maintenance')} 
          />
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
            <img src="https://picsum.photos/seed/admin/40/40" className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" alt="Admin" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-black text-white truncate">Officer Mensah</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Duty Master</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 px-2 text-gray-600">
            <Globe size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Hakilix Labs UK</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#1a1a1a_0%,_#0a0a0a_100%)]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">{activeTab}</h2>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500/60 font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              CLUSTER_ANANSE_ONLINE // ACCRA_DC_01
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
               <Zap size={14} className="text-amber-500" />
               <span className="text-[10px] font-mono font-black text-gray-500 uppercase">Proprietary: Musah Shaibu</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full relative group transition-all active:scale-95">
              <Bell size={20} className="text-gray-400 group-hover:text-white" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0a0a] shadow-lg"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'live' && <LiveFeed />}
          {activeTab === 'violations' && <ViolationReview onClearBadge={() => setUnreadCount(0)} />}
          {activeTab === 'maintenance' && <Maintenance />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: number }> = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
      active ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
    }`}
  >
    <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-500`}>
      {icon}
    </div>
    <span className="hidden lg:block font-black text-xs uppercase tracking-widest">{label}</span>
    {badge && (
      <span className="absolute right-4 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
        {badge}
      </span>
    )}
    {active && (
      <div className="absolute left-0 w-1.5 h-6 bg-black rounded-r-full"></div>
    )}
  </button>
);

export default App;