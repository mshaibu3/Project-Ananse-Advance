
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Activity, Globe, Wallet, ShieldCheck, Lock, Zap, TrendingUp, Cpu } from 'lucide-react';

const flowData = [
  { name: '00:00', revenue: 1200, integrity: 99.9 },
  { name: '04:00', revenue: 800, integrity: 99.8 },
  { name: '08:00', revenue: 4500, integrity: 100 },
  { name: '12:00', revenue: 3200, integrity: 99.9 },
  { name: '16:00', revenue: 5800, integrity: 100 },
  { name: '20:00', revenue: 2500, integrity: 99.7 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Dynamic Stat Cards - Enhanced Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Security Integrity" 
          value="100.0%" 
          change="SECURE" 
          icon={<ShieldCheck size={20} />} 
          color="emerald" 
          glowColor="rgba(16, 185, 129, 0.25)" 
        />
        <StatCard 
          title="Revenue (GHS)" 
          value="482.5K" 
          change="+24.1%" 
          icon={<Wallet size={20} />} 
          color="blue" 
          glowColor="rgba(59, 130, 246, 0.25)" 
        />
        <StatCard 
          title="Node Synchronicity" 
          value="STABLE" 
          change="ACTIVE" 
          icon={<Cpu size={20} />} 
          color="purple" 
          glowColor="rgba(168, 85, 247, 0.25)" 
        />
        <StatCard 
          title="Cyber Threat Scan" 
          value="CLEAN" 
          change="0 DETECTED" 
          icon={<ShieldAlert size={20} />} 
          color="amber" 
          glowColor="rgba(245, 158, 11, 0.25)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <div className="lg:col-span-2 relative group">
          {/* Chart Container - Deep Translucency */}
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-[3.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="relative bg-[#0d0d0d]/40 backdrop-blur-[40px] border border-white/10 rounded-[3.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Live Flux Monitor</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">Neural Network Load</h3>
                <p className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-[0.2em] font-black">Segment: ACCRA_N1_INTERCHANGE</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-[9px] font-mono text-gray-500 uppercase font-bold">Peak Throughput</p>
                    <p className="text-sm font-black text-white">4.2 TB/s</p>
                 </div>
                 <TrendingUp size={18} className="text-emerald-500" />
              </div>
            </div>

            <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="neonEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#ffffff08" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#444" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontWeight: 700 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px',
                      padding: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fill="url(#neonEmerald)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative bg-[#0d0d0d]/40 backdrop-blur-[40px] border border-white/10 rounded-[3.5rem] p-10 shadow-2xl flex flex-col h-full group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-3">
              <Activity className="text-emerald-500" /> V2X Intelligence
            </h3>
            <div className="space-y-12 flex-1">
              <Progress label="Edge Inference Efficiency" value={99.4} color="emerald" />
              <Progress label="Quantum Encryption Strength" value={100} color="blue" />
              <Progress label="Zero-Day Resilience" value={82.1} color="purple" />
              <Progress label="Network Decentralization" value={94.2} color="amber" />
            </div>
            
            <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={64} />
              </div>
              <div className="flex items-center gap-4 text-emerald-500 mb-2">
                <Zap size={20} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Zero-Trust Perimeter</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                All edge citations are cryptographically signed before local buffer commit. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Progress: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="group/progress">
    <div className="flex justify-between mb-3 items-end">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-mono font-black text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
      <div 
        className={`h-full bg-${color}-500 transition-all duration-[2000ms] ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

const StatCard: React.FC<{ title: string, value: string, change: string, icon: React.ReactNode, color: string, glowColor: string }> = ({ title, value, change, icon, color, glowColor }) => (
  <div className="relative group cursor-default">
    <div className="absolute -inset-2 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-3xl" style={{ backgroundColor: glowColor }}></div>
    <div className="relative h-full bg-[#0d0d0d]/60 backdrop-blur-[32px] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/[0.05]">
      {/* Light Source Glint */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-${color}-400 bg-${color}-500/10 border border-${color}-500/20 mb-10 transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3 font-black">{title}</p>
      <h4 className="text-3xl font-black text-white tracking-tighter mb-4">{value}</h4>
      <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} border border-white/5`}>
        {change}
      </div>
    </div>
  </div>
);

export default Dashboard;
