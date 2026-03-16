'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState({ cpu: 84, ram: 52, net: 1.9 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * (88 - 80 + 1) + 80),
        ram: Math.floor(Math.random() * (55 - 50 + 1) + 50),
        net: parseFloat((Math.random() * (2.1 - 1.8) + 1.8).toFixed(1))
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const MetricBar = ({ label, value, max = 100, unit = '%' }: { label: string, value: number, max?: number, unit?: string }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</span>
        <span className="text-lg font-mono font-black text-aether-neon tracking-tighter">
          {value}{unit}
        </span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-sm overflow-hidden flex gap-0.5 p-0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: i < (value / max) * 20 ? 1 : 0.1,
              backgroundColor: i < (value / max) * 20 ? '#00FF41' : 'rgba(255,255,255,0.1)'
            }}
            className="h-full flex-1 rounded-[1px]"
            transition={{ duration: 0.5, delay: i * 0.02 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 backdrop-blur-xl space-y-6 group hover:border-aether-neon/30 transition-all duration-500"
    >
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">System Overview</h3>
        <p className="text-[8px] font-mono text-white/20 uppercase">Gemigram_AIOS / Sovereign • Kernel: Stable</p>
      </div>

      <div className="space-y-4">
        <MetricBar label="CPU Usage" value={metrics.cpu} />
        <MetricBar label="RAM Matrix" value={metrics.ram} />
        <div className="pt-2 flex justify-between items-center border-t border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">NET Throughput</span>
          <span className="text-sm font-mono font-black text-aether-neon">{metrics.net} TB/s</span>
        </div>
      </div>
    </motion.div>
  );
}
