
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, BrainCircuit, ScanEye, 
  ShieldCheck, Lock, Eye, Activity, Fingerprint, UserCheck, ShieldX, Loader2, Compass,
  Database
} from 'lucide-react';
import { Violation, DriverIdentity } from '../types';
import { db } from '../services/database';

const ViolationReview: React.FC<{ onClearBadge: () => void }> = ({ onClearBadge }) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  useEffect(() => {
    const list = db.getViolations();
    const enhancedList = list.map(v => {
      // Mocking advanced biometric data if not present
      if (!v.driver) {
        return {
          ...v,
          driver: {
            idConfirmed: Math.random() > 0.2,
            matchConfidence: 0.88 + Math.random() * 0.1,
            identifiedName: "Registry Match: SHAIBU_M",
            occlusionDetected: Math.random() > 0.6,
            occlusionType: ['SUNGLASSES', 'MASK', 'HAND', 'NONE'][Math.floor(Math.random() * 4)] as any,
            occlusionResilienceScore: 0.85 + Math.random() * 0.12,
            reasoning: "Deep neural landmarking confirmed identity via ear-lobe and jawline geometry."
          },
          evidence: {
            ...v.evidence,
            metadata: {
              ...v.evidence.metadata,
              gaze: ['ROAD', 'LAP', 'DEVICE', 'PASSENGER'][Math.floor(Math.random() * 4)],
              gaze_confidence: 0.91 + Math.random() * 0.08,
            }
          }
        } as Violation;
      }
      return v;
    });
    setViolations(enhancedList);
    if (enhancedList.length > 0) setSelectedId(enhancedList[0].id);
  }, []);

  useEffect(() => {
    if (selectedId) {
      setBiometricLoading(true);
      const timer = setTimeout(() => setBiometricLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedId]);

  const selected = violations.find(v => v.id === selectedId);

  const handleAction = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedId) return;
    setIsVerifying(true);
    setTimeout(() => {
      db.deleteViolation(selectedId);
      const updatedList = db.getViolations();
      setViolations(updatedList);
      if (updatedList.length === 0) onClearBadge();
      setSelectedId(updatedList[0]?.id || null);
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-4 space-y-4">
        {/* Fixed: Added Database icon to imports and used it here */}
        <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] font-black px-2 flex items-center gap-2">
          <Database size={12} /> Secure Evidence Ledger
        </h3>
        <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
          {violations.map(v => (
            <button key={v.id} onClick={() => setSelectedId(v.id)} className={`w-full text-left p-5 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${selectedId === v.id ? 'bg-white/5 border-white/20 shadow-2xl scale-[1.02]' : 'bg-[#0d0d0d]/40 border-white/5'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[8px] font-mono text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-lg">BLOCK_{v.ledgerHash.substring(0, 4).toUpperCase()}</span>
                <span className="text-[9px] font-black text-gray-400 uppercase">{v.type}</span>
              </div>
              <p className="font-black text-white mb-2 tracking-tighter text-xl">{v.vehicle.plate}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span className="flex items-center gap-2"><Lock size={10} /> {v.id}</span>
                <span className="text-emerald-500">GHS {v.fineAmount}</span>
              </div>
              {selectedId === v.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selected ? (
          <div className="bg-[#0d0d0d]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full animate-in zoom-in-95 duration-500">
            <div className="relative aspect-video bg-black group overflow-hidden">
              <img src={selected.evidence.imageUrl} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Evidence" />
              
              {/* Scanning Overlay Effect */}
              {biometricLoading && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-scan"></div>
                  <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center">
                    <div className="bg-black/80 p-6 rounded-3xl border border-emerald-500/20 flex flex-col items-center gap-4">
                       <Loader2 className="text-emerald-500 animate-spin" size={32} />
                       <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black">Biometric_Link_Active</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                 <div className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-mono font-black text-white uppercase tracking-widest">IMPREGNABLE_EVIDENCE_SOURCE</span>
                 </div>
                 <div className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">LEDGER_HASH: {selected.ledgerHash.substring(0, 12)}...</span>
                 </div>
              </div>

              {/* Identity Overlay */}
              {!biometricLoading && (
                <div className="absolute bottom-6 right-6 animate-in fade-in zoom-in-95 duration-500">
                   <div className={`bg-black/90 backdrop-blur-xl px-4 py-2 rounded-2xl border flex items-center gap-3 ${selected.driver?.idConfirmed ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}>
                      {selected.driver?.idConfirmed ? <UserCheck className="text-emerald-500" size={16} /> : <ShieldX className="text-amber-500" size={16} />}
                      <div className="text-[10px] font-mono font-black text-white uppercase tracking-widest">
                         {selected.driver?.idConfirmed ? 'ID_CONFIRMED' : 'ID_UNVERIFIED'}
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              {/* Security & Intelligence Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <IntelligenceCard icon={<Fingerprint size={16} />} label="Auth Chain" value="SECURE" />
                <IntelligenceCard icon={<Activity size={16} />} label="Gaze Vector" value={selected.evidence.metadata.gaze || 'UNKNOWN'} color={selected.evidence.metadata.gaze === 'ROAD' ? 'text-emerald-500' : 'text-amber-500'} />
                <IntelligenceCard icon={<UserCheck size={16} />} label="Face Match" value={selected.driver?.idConfirmed ? `${(selected.driver.matchConfidence * 100).toFixed(1)}%` : 'PENDING'} />
                <IntelligenceCard icon={<Compass size={16} />} label="Gaze Conf." value={selected.evidence.metadata.gaze_confidence ? `${(selected.evidence.metadata.gaze_confidence * 100).toFixed(1)}%` : 'N/A'} />
              </div>

              {selected.driver && !biometricLoading && (
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative group">
                  <div className="absolute top-8 right-8 flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[8px] font-mono text-gray-500 uppercase font-black">Resilience</span>
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-emerald-500" style={{ width: `${selected.driver.occlusionResilienceScore * 100}%` }}></div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selected.driver.idConfirmed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        <ScanEye size={28} />
                     </div>
                     <div>
                        <h5 className="text-[10px] font-mono font-black text-emerald-500 uppercase tracking-widest mb-1">Biometric Intelligence Report</h5>
                        <p className="text-xl font-black text-white tracking-tight">{selected.driver.identifiedName || 'Unidentified Subject'}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                        <span>Occlusion Type</span>
                        <span className="text-white font-black">{selected.driver.occlusionType || 'NONE'}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                        <span>Gaze Direction</span>
                        <span className={`font-black ${selected.evidence.metadata.gaze === 'ROAD' ? 'text-emerald-500' : 'text-amber-500'}`}>{selected.evidence.metadata.gaze || 'STATIONARY'}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                        <span>Detected Gaze Confidence</span>
                        <span className="text-white font-black">{selected.evidence.metadata.gaze_confidence ? `${(selected.evidence.metadata.gaze_confidence * 100).toFixed(1)}%` : '0%'}</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-2">
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase mb-2">
                        <BrainCircuit size={12} className="text-emerald-500" /> AI Reasoning Logic
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">
                        "{selected.driver.reasoning}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-mono uppercase font-black tracking-widest text-gray-500 flex items-center gap-2">
                    <Activity size={14} className="text-emerald-500" /> Neural_Audit_Summary
                  </h5>
                  <ShieldCheck className="text-emerald-500" size={16} />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                  ANANSE Core has cross-referenced the plate <span className="text-white font-black">{selected.vehicle.plate}</span> with the DVLA central registry. Vehicle behavioral profile flagged as <span className="text-amber-500 font-black">{selected.vehicle.behavioralProfile}</span>. Biometric scan confirmed identity with {selected.driver?.matchConfidence ? (selected.driver.matchConfidence * 100).toFixed(1) : 0}% confidence. Environmental lighting compensated.
                </p>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  onClick={() => handleAction('REJECTED')} 
                  disabled={isVerifying}
                  className="flex-1 flex items-center justify-center gap-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 p-6 rounded-[2rem] font-black transition-all text-[10px] uppercase tracking-widest"
                >
                  <XCircle size={18} /> {isVerifying ? 'INVALIDATING...' : 'DISCARD'}
                </button>
                <button 
                  onClick={() => handleAction('APPROVED')} 
                  disabled={isVerifying}
                  className="flex-[2] flex items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-400 text-black p-6 rounded-[2rem] font-black transition-all text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20"
                >
                  <ShieldCheck size={18} /> {isVerifying ? 'BLOCK_COMMITTING...' : 'COMMIT_TO_LEDGER'}
                </button>
              </div>
            </div>
          </div>
        ) : <EmptyState />}
      </div>
    </div>
  );
};

const IntelligenceCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color?: string }> = ({ icon, label, value, color = "text-white" }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/10 transition-colors">
    <div className="text-gray-500 mb-2 group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-[8px] font-mono text-gray-500 uppercase mb-1 font-black">{label}</p>
    <p className={`text-[10px] font-black uppercase ${color}`}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-[#0d0d0d]/40 rounded-[4rem] border border-dashed border-white/5">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
       <Lock size={32} className="text-white/10" />
    </div>
    <h3 className="text-xl font-black text-white/20 uppercase tracking-widest">No Active Citations in Queue</h3>
    <p className="text-xs text-gray-600 mt-2 font-mono">Cluster Ananse is monitoring segment N1-ACCRA.</p>
  </div>
);

export default ViolationReview;
