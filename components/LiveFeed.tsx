import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Maximize2, RefreshCw, Activity, Wind, ScanText, Sparkles, LayoutGrid, Square, Monitor, ShieldAlert, Cpu, Network, Clock, Eye } from 'lucide-react';
import { LOCATIONS } from '../constants';

const GridDetectionOverlay: React.FC<{ seed: number, active: boolean }> = ({ seed, active }) => {
  const [boxState, setBoxState] = useState({ x: -20, opacity: 0 });

  useEffect(() => {
    if (!active) return;
    
    let frameId: number;
    const startTime = Date.now() + (seed * 1000); // Offset based on seed for variety
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const cycle = 8 + (seed % 4); // Varying cycle lengths
      const progress = (elapsed % cycle) / cycle;
      
      const x = -30 + (progress * 160);
      const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;
      
      setBoxState({ x, opacity });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [active, seed]);

  if (!active) return null;

  return (
    <div 
      className="absolute border border-emerald-500/30 bg-emerald-500/5 pointer-events-none transition-opacity duration-300"
      style={{
        left: `${boxState.x}%`,
        top: `${55 + (seed % 3) * 5}%`,
        width: '25%',
        height: '30%',
        opacity: boxState.opacity * 0.6,
      }}
    >
      <div className="absolute -top-3 left-0 bg-emerald-500/40 px-1 rounded-t-[2px]">
        <span className="text-[6px] font-mono font-black text-black leading-none block uppercase">V_{700 + seed}</span>
      </div>
      {/* Scanning Line Pulse */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-scan"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(16,185,129,0.05)_100%)]"></div>
    </div>
  );
};

const CabinPulseOverlay: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div className="absolute top-[58%] left-[42%] w-24 h-24 pointer-events-none animate-in fade-in zoom-in duration-700">
      {/* Outer Pulse */}
      <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-radar"></div>
      {/* Target Reticle */}
      <div className="absolute inset-0 border border-blue-500/10 rounded-full flex items-center justify-center">
         <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-blue-500/40"></div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-blue-500/40"></div>
         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-blue-500/40"></div>
         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-blue-500/40"></div>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-500/90 text-black px-1.5 py-0.5 rounded text-[7px] font-mono font-black uppercase tracking-widest">
        CABIN_GAN_LOCKED
      </div>
    </div>
  );
};

const LiveFeed: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [isProcessing, setIsProcessing] = useState(true);
  const [deHaze, setDeHaze] = useState(false);
  const [ganActive, setGanActive] = useState(true);
  const [trOcrActive, setTrOcrActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [metrics, setMetrics] = useState({
    fps: 42.4,
    latency: 12,
    bitrate: '8.4 Mbps',
    alertCount: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setMetrics(prev => ({
        fps: +(42.0 + Math.random() * 0.8).toFixed(1),
        latency: Math.floor(10 + Math.random() * 5),
        bitrate: `${(8.0 + Math.random() * 0.9).toFixed(1)} Mbps`,
        alertCount: Math.random() > 0.95 ? prev.alertCount + 1 : prev.alertCount
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (viewMode !== 'single') return;
    
    let frameId: number;
    const ctx = canvasRef.current?.getContext('2d');
    
    const draw = () => {
      if (!ctx || !canvasRef.current) return;
      const { width, height } = canvasRef.current;
      ctx.clearRect(0, 0, width, height);

      if (isProcessing) {
        const t = Date.now() / 1000;
        const x1 = (t * 200) % (width + 300) - 300;
        const y1 = height * 0.6;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(x1, y1, 200, 120);
        
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.fillRect(x1, y1 - 25, 160, 25);
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px JetBrains Mono';
        ctx.fillText(`ID: VEH_T-${Math.floor(x1 % 1000)}`, x1 + 8, y1 - 8);
        
        if (trOcrActive) {
          ctx.fillStyle = '#000';
          ctx.fillRect(x1 + 10, y1 + 90, 100, 20);
          ctx.fillStyle = '#fff';
          ctx.fillText(`GR-503-24`, x1 + 15, y1 + 105);
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 8px JetBrains Mono';
          ctx.fillText('OCR: 99.2%', x1 + 115, y1 + 105);
        }

        if (ganActive) {
          ctx.strokeStyle = '#3b82f6';
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.arc(x1 + 100, y1 + 40, 35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#3b82f6';
          ctx.fillText('CABIN_GAN', x1 + 140, y1 + 45);
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [isProcessing, ganActive, trOcrActive, viewMode]);

  const aiLogs = useMemo(() => [
    `Analyzing stream NODE_${selectedCamera + 101}...`,
    `TrOCR context initialized: GH_STD_2024`,
    `Edge AI model quantized for Jetson Orin`,
    `Visual Fingerprinting active: Cross-DVLA enabled`,
    `Atmospheric Correction factor: 0.12 (Low Haze)`,
    `Seatbelt Geometry tracking established`
  ], [selectedCamera]);

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#121212]/50 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-white/5 ring-1 ring-white/5 gap-4">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex bg-black p-1 rounded-xl border border-white/10 flex-1 sm:flex-none">
            <button 
              onClick={() => setViewMode('single')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'single' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Square size={14} /> <span className="hidden xs:inline">SINGLE_NODE</span>
            </button>
            <button 
              onClick={() => setViewMode('multi')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'multi' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <LayoutGrid size={14} /> <span className="hidden xs:inline">MONITOR_WALL</span>
            </button>
          </div>
          <div className="hidden md:block h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden lg:inline">AI_ENGINE: NOMINAL</span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 group border border-white/5 sm:border-none">
              <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 h-full">
          <div className="lg:col-span-3 space-y-6">
            <div className={`relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-black group transition-all duration-700 ${deHaze ? 'brightness-110 saturate-110' : 'brightness-75 contrast-90 sepia-[0.2]'}`}>
              <img 
                src={`https://picsum.photos/seed/${selectedCamera + 42}/1280/720`} 
                className={`w-full h-full object-cover transition-all duration-1000 ${deHaze ? 'blur-0' : 'blur-[2px] opacity-70'}`} 
                alt="Live Feed"
              />
              
              <canvas 
                ref={canvasRef}
                width={1280}
                height={720}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: overlayOpacity }}
              />

              <CabinPulseOverlay active={ganActive && isProcessing} />

              <div className="absolute inset-0 pointer-events-none p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-black text-emerald-500/80 uppercase tracking-widest">Live Node Active</p>
                        <h4 className="text-white font-black text-sm tracking-tight">NODE_{selectedCamera + 101} // {LOCATIONS[selectedCamera].split(' - ')[0]}</h4>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {deHaze && (
                        <div className="bg-blue-500 text-black px-2 py-1 rounded-lg font-mono text-[9px] font-bold flex items-center gap-1.5 animate-in slide-in-from-left duration-300">
                            <Wind size={10} /> DEHAZE_CORE
                        </div>
                        )}
                        {ganActive && (
                        <div className="bg-purple-500 text-white px-2 py-1 rounded-lg font-mono text-[9px] font-bold flex items-center gap-1.5 animate-in slide-in-from-left delay-75 duration-300">
                            <Sparkles size={10} /> GAN_RESTORATION
                        </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-4 text-[10px] font-mono shadow-2xl">
                       <div className="text-right">
                          <p className="text-gray-500 uppercase font-black">Local Time</p>
                          <p className="text-white font-bold">{currentTime.toLocaleTimeString()}</p>
                       </div>
                       <div className="w-px h-6 bg-white/10"></div>
                       <div className="text-right">
                          <p className="text-gray-500 uppercase font-black">Date</p>
                          <p className="text-white font-bold">{currentTime.toLocaleDateString('en-GB')}</p>
                       </div>
                    </div>
                    
                    {metrics.alertCount > 0 && (
                      <div className="bg-red-500 text-black px-4 py-2 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <ShieldAlert size={14} /> {metrics.alertCount} Active Anomalies
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 w-64 shadow-2xl overflow-hidden group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={12} /> Neural Stream
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <div className="space-y-1.5 h-20 overflow-hidden font-mono text-[8px] text-gray-400">
                      {aiLogs.map((log, i) => (
                        <p key={i} className="truncate group-hover:text-emerald-500/50 transition-colors">[{currentTime.getSeconds() + i}s] {log}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MetricBox icon={<Activity size={14} />} label="FPS" value={metrics.fps.toString()} unit="Hz" />
                    <MetricBox icon={<Network size={14} />} label="Ping" value={metrics.latency.toString()} unit="ms" color="text-emerald-500" />
                    <MetricBox icon={<Activity size={14} />} label="Bitrate" value={metrics.bitrate.split(' ')[0]} unit="Mbps" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] opacity-10"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#121212] p-4 sm:p-6 rounded-[2rem] border border-white/5 ring-1 ring-white/5 shadow-2xl">
              <div className="grid grid-cols-2 xs:flex xs:flex-wrap gap-2 sm:gap-3">
                <ControlToggle label="Atmosphere" active={deHaze} onClick={() => setDeHaze(!deHaze)} icon={<Wind size={16} />} />
                <ControlToggle label="GAN_Sync" active={ganActive} onClick={() => setGanActive(!ganActive)} icon={<Sparkles size={16} />} />
                <ControlToggle label="TrOCR" active={trOcrActive} onClick={() => setTrOcrActive(!trOcrActive)} icon={<ScanText size={16} />} />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-black shrink-0">HUD Alpha</span>
                <input type="range" min="0" max="1" step="0.1" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} className="flex-1 md:w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest px-2">Sector Grid</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[400px] lg:max-h-full overflow-y-auto pr-2 custom-scrollbar">
              {LOCATIONS.map((loc, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedCamera(idx)}
                  className={`w-full text-left p-4 rounded-3xl border transition-all duration-300 group ${
                    selectedCamera === idx ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'bg-[#121212] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${selectedCamera === idx ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-gray-400'}`}>
                      NODE_{101 + idx}
                    </span>
                    <Activity size={12} className={idx % 3 === 0 ? 'text-emerald-500' : 'text-amber-500'} />
                  </div>
                  <p className={`text-sm font-semibold truncate transition-colors ${selectedCamera === idx ? 'text-emerald-500' : 'text-gray-200'}`}>{loc.split(' - ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-700 pb-12">
          {LOCATIONS.map((loc, idx) => (
            <div 
              key={idx}
              className="group relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 ring-1 ring-white/5 hover:ring-emerald-500/50 hover:border-emerald-500/30 transition-all cursor-pointer shadow-xl hover:shadow-emerald-500/10 active:scale-[0.98]"
              onClick={() => {
                setSelectedCamera(idx);
                setViewMode('single');
              }}
            >
              <img 
                src={`https://picsum.photos/seed/${idx + 42}/640/360`} 
                className="w-full h-full object-cover opacity-60 grayscale-[0.2] group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" 
                alt={loc}
              />
              
              <GridDetectionOverlay seed={idx} active={isProcessing} />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="bg-black/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[8px] font-mono font-bold tracking-tight uppercase">
                    NODE_{101 + idx}
                  </div>
                  <div className="flex gap-1">
                    {idx % 3 === 0 && <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[7px] font-bold animate-pulse shadow-lg shadow-red-500/20">ALERT</div>}
                    <div className="bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded text-[7px] font-bold border border-emerald-500/30 backdrop-blur-sm">LIVE</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-white font-black text-xs sm:text-sm tracking-tight drop-shadow-lg truncate uppercase">{loc.split(' - ')[0]}</p>
                  <div className="flex gap-3 text-[7px] sm:text-[8px] font-mono text-gray-500">
                    <span className="flex items-center gap-1 font-bold">{metrics.fps} FPS</span>
                    <span className="flex items-center gap-1">L: {metrics.latency + idx}ms</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="bg-emerald-500 text-black p-3 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.6)] transform scale-75 group-hover:scale-100 transition-transform">
                    <Maximize2 size={24} strokeWidth={3} />
                 </div>
              </div>
            </div>
          ))}
          
          <div className="hidden xl:flex aspect-video bg-white/5 border border-dashed border-white/10 rounded-3xl items-center justify-center group hover:bg-white/[0.07] transition-colors cursor-wait">
            <div className="text-center space-y-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Activity size={24} className="mx-auto" />
                <p className="text-[10px] font-mono uppercase tracking-widest font-black">Scanning Cluster...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricBox: React.FC<{ icon: React.ReactNode, label: string, value: string, unit: string, color?: string }> = ({ icon, label, value, unit, color = "text-white" }) => (
  <div className="bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
    <div className={`p-2 bg-white/5 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-xs font-mono font-bold ${color}`}>
        {value}<span className="text-[8px] text-gray-600 ml-1 uppercase">{unit}</span>
      </p>
    </div>
  </div>
);

const ControlToggle: React.FC<{ label: string, active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl border transition-all duration-300 ${
      active 
      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
      : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
    }`}
  >
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default LiveFeed;