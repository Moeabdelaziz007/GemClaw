'use client';

import { motion } from 'motion/react';
import { Code2, Cloud, Bitcoin, Sparkles } from 'lucide-react';
import { EphemeralWidget } from './ui/EphemeralWidget';

export function WidgetRenderer({ data }: { data: any }) {
  if (!data) return null;

  if (data.temperature !== undefined) {
    return (
      <EphemeralWidget className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6">
          <Cloud className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{data.location}</h2>
        <div className="text-6xl font-light text-cyan-400 mb-4">{data.temperature}°C</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{data.condition}</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Humidity: {data.humidity}</span>
        </div>
      </EphemeralWidget>
    );
  }

  if (data.symbol !== undefined) {
    const isPositive = !data.change24h.startsWith('-');
    return (
      <EphemeralWidget className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
          <Bitcoin className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{data.symbol}</h2>
        <div className="text-5xl font-light text-amber-400 mb-4">{data.price}</div>
        <div className={`flex items-center gap-2 font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{data.change24h} (24h)
        </div>
      </EphemeralWidget>
    );
  }

  // Fallback for unknown tools
  return (
    <EphemeralWidget className="w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Tool Execution Output</h2>
          <p className="text-xs text-slate-400 font-mono">Raw JSON Data</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar bg-black/20 rounded-xl p-4 border border-white/5">
        <pre className="text-cyan-300/80 font-mono text-xs leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </EphemeralWidget>
  );
}
