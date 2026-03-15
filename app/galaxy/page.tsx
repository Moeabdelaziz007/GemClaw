'use client';

import { useAetherStore } from '@/lib/store/useAetherStore';
import { Brain, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function GalaxyPage() {
  const { agents, setActiveAgentId, activeAgentId } = useAetherStore();
  const router = useRouter();

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col relative overflow-hidden">
      <div className="relative z-20 mb-12">
        <h2 className="text-4xl font-black tracking-tighter mb-2 uppercase">Aether Galaxy</h2>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Sovereign Planet Architecture // Live Orchestration</p>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        {/* Dark Matter Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />

        {/* Central Sun (Sovereign Core) */}
        <div className="relative group">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: 360
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px] absolute -inset-16"
          />
          <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-700">
            <Brain className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          </div>
          
          {/* Core Labels */}
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 animate-pulse">Core Active</div>
          </div>
        </div>

        {/* Orbital Paths */}
        {[200, 320, 450].map((r, i) => (
          <div key={i} className="absolute border border-white/[0.03] rounded-full pointer-events-none" style={{ width: r*2, height: r*2 }} />
        ))}

        {/* Orbiting Agent Planets */}
        {agents.map((agent, i) => {
          const radius = 220 + (i * 40);
          const duration = 15 + (i * 5);
          const delay = i * -3.5;
          
          return (
            <motion.div
              key={agent.id}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: "linear", delay }}
              className="absolute"
              style={{ width: radius * 2, height: radius * 2 }}
            >
              <motion.div 
                initial={{ rotate: -delay * (360/duration) }}
                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2"
              >
                <button 
                  onClick={() => {
                    setActiveAgentId(agent.id);
                    router.push('/workspace');
                  }}
                  className="group relative flex flex-col items-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.4 }}
                    className={`w-14 h-14 rounded-full bg-slate-900 border-2 flex items-center justify-center transition-all ${
                      activeAgentId === agent.id ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <Globe className={`w-6 h-6 ${activeAgentId === agent.id ? 'text-cyan-400' : 'text-white/20'}`} />
                    
                    {/* Agent Label Bubble */}
                    <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 pointer-events-none">
                      <div className="quantum-glass p-3 border border-white/10 rounded-2xl min-w-[120px]">
                        <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Entity // {i+1}</div>
                        <div className="text-xs font-black text-white">{agent.name}</div>
                        <div className="text-[9px] text-cyan-400 mt-1 font-mono uppercase">{agent.role}</div>
                      </div>
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Galaxy Stats Board */}
      <div className="absolute bottom-12 right-12 z-20 hidden lg:block">
        <div className="quantum-glass p-6 border border-white/5 rounded-[2rem] w-64">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Gravity Field Stats</div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Entities Attached</span>
              <span className="text-xs font-bold text-white">{agents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Core Sync-Rate</span>
              <span className="text-xs font-bold text-cyan-400">99.8%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['0%', '99%', '99%'] }}
                transition={{ duration: 2 }}
                className="h-full bg-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
