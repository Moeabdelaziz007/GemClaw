'use client';

import { motion } from 'motion/react';

interface AgentCardProps {
  name: string;
  status: 'sleeping' | 'working' | 'connected';
  color?: 'cyan' | 'purple' | 'emerald';
  onClick?: () => void;
}

export function AgentCard({ name, status, color = 'cyan', onClick }: AgentCardProps) {
  const colorMap = {
    cyan: 'from-cyan-500 to-blue-600',
    purple: 'from-purple-500 to-pink-600',
    emerald: 'from-emerald-500 to-teal-600',
  };

  const statusColorMap = {
    sleeping: 'bg-slate-500',
    working: 'bg-amber-500',
    connected: 'bg-emerald-500',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer aspect-square rounded-[2rem] quantum-glass overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] hover:border-white/20"
    >
      {/* The Soul (Breathing Orb) */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: status === 'working' ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-br ${colorMap[color]} group-hover:opacity-80 transition-opacity duration-500`}
        />
        <div className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br ${colorMap[color]} shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]`} />
      </div>

      {/* Agent Info */}
      <h3 className="text-xl font-bold text-white tracking-tight mb-2 z-10">{name}</h3>
      
      {/* Status Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5 backdrop-blur-md z-10">
        <div className={`w-2 h-2 rounded-full ${statusColorMap[status]} ${status === 'working' ? 'animate-pulse' : ''}`} />
        <span className="text-xs font-medium text-slate-300 capitalize">{status}</span>
      </div>

      {/* Hover Glow Border Effect */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}
