
import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, Zap, Activity, Thermometer, 
  Cpu, Globe, Terminal, AlertTriangle, CloudOff, 
  CameraOff, Wrench, CheckCircle2 
} from 'lucide-react';

interface PredictiveAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'STABLE';
  node: string;
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

const Maintenance: React.FC = () => {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([
    { 
      id: 'AL-104', 
      type: 'CRITICAL', 
      node: 'Node 104', 
      message: 'Core temperature exceeding safety threshold (84°C). Cooling failure imminent.', 
      timestamp: '2 mins ago',
      icon: <Thermometer className="text-red-500" />
    },
    { 
      id: 'AL-101', 
      type: 'WARNING', 
      node: 'Node 101', 
      message: 'Lens obstruction detected (Dust/Harmattan accumulation). Visibility reduced by 22%.', 
      timestamp: '15 mins ago',
      icon: <CameraOff className="text-amber-500" />
    },
    { 
      id: 'AL-N1', 
      type: 'WARNING', 
      node: 'N1 Highway Segment', 
      message: 'Network latency degrading. Edge-to-Cloud sync delay at 450ms.', 
      timestamp: '45 mins ago',
      icon: <CloudOff className="text-amber-500" />
    }
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Cyber Defense Banner */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[3rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 relative z-10">
          <div className="w-16 h-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">ANANSE_SHIELD: NOMINAL</h3>
            <p className="text-sm text-gray-400 font-medium">All edge nodes are utilizing <b>Quantum-Resistant Chaining</b>. Intrusion detection system is active.</p>
          </div>
          <div className="lg:ml-auto grid grid-cols-2 gap-4">
            <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-mono text-gray-500 uppercase font-black mb-1">Threat Level</p>
              <p className="text-sm font-black text-emerald-500">LOW</p>
            </div>
            <div className="bg-black/40 px-6 py-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-mono text-gray-500 uppercase font-black mb-1">Enc Level</p>
              <p className="text-sm font-black text-blue-500">Q-AES-256</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Predictive Diagnostics Section */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Activity className="text-amber-500" /> Predictive Diagnostics
              </h3>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">AI_HEALTH_RADAR</span>
            </div>
            
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert.id} className="group relative bg-white/5 border border-white/5 rounded-3xl p-6 transition-all hover:bg-white/[0.07] hover:border-white/10">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                      {alert.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-white tracking-tight uppercase text-sm">
                          {alert.node} <span className="text-gray-600 font-mono text-[10px] ml-2">[{alert.id}]</span>
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xl">
                        {alert.message}
                      </p>
                    </div>
                    <button 
                      onClick={() => dismissAlert(alert.id)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-emerald-500 hover:text-black transition-all text-gray-500"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                  {alert.type === 'CRITICAL' && (
                    <div className="absolute top-0 right-0 h-full w-1 bg-red-500 rounded-r-3xl animate-pulse"></div>
                  )}
                </div>
              )) : (
                <div className="text-center py-10 space-y-3 opacity-20">
                  <ShieldAlert size={48} className="mx-auto" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-black">All Nodes Healthy</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Terminal className="text-emerald-500" /> Security Log
            </h3>
            <div className="space-y-4 font-mono">
              <LogEntry time="14:22:05" type="INFO" msg="Violation V-83921 hashed into ledger block #4492." />
              <LogEntry time="14:15:12" type="WARN" msg="Node 102 reported EMI interference. Auto-shielding active." />
              <LogEntry time="13:58:30" type="AUTH" msg="Admin Mensah authenticated via NIA Biometric Sync." />
              <LogEntry time="12:00:00" type="SYS" msg="Swarm-wide neural update deployed: CABIN_SCAN_v5.2" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
               <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                  <ShieldAlert size={48} className="text-emerald-500 animate-pulse" />
               </div>
               <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-tighter">Self-Healing Core</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">ANANSE is continuously auditing its own code for visual-drift and neural hallucinations.</p>
            </div>
            <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Execute Integrity Audit</button>
          </div>

          <div className="bg-[#0d0d0d] border border-white/5 rounded-[3rem] p-8 space-y-6">
            <h4 className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Technician Dispatch</h4>
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group cursor-pointer hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                <Wrench size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white">Rapid Response Unit</p>
                <p className="text-[8px] font-mono text-gray-500">Estimated Arrival: 14m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogEntry: React.FC<{ time: string, type: string, msg: string }> = ({ time, type, msg }) => (
  <div className="flex gap-4 text-[10px]">
    <span className="text-gray-600">[{time}]</span>
    <span className={`font-black ${type === 'WARN' ? 'text-amber-500' : type === 'AUTH' ? 'text-blue-500' : 'text-emerald-500'}`}>{type}</span>
    <span className="text-gray-400">{msg}</span>
  </div>
);

export default Maintenance;
