'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Brain, Zap, Activity } from 'lucide-react';

export type AgentType = 'Forge' | 'Memory' | 'Skills';

interface MiniAgentHUDProps {
  type: AgentType;
  status: string;
  isBusy?: boolean;
}

const themeMap = {
  Forge: {
    color: '#FBBF24', // Gold
    icon: Sparkles,
    glow: 'rgba(251, 191, 36, 0.4)',
    label: 'FORGE_ASSISTANT'
  },
  Memory: {
    color: '#34D399', // Emerald
    icon: Brain,
    glow: 'rgba(52, 211, 153, 0.4)',
    label: 'MEMORY_ASSISTANT'
  },
  Skills: {
    color: '#A855F7', // Purple
    icon: Zap,
    glow: 'rgba(168, 85, 247, 0.4)',
    label: 'SKILLS_ASSISTANT'
  }
};

export default function MiniAgentHUD({ type, status, isBusy }: MiniAgentHUDProps) {
  const theme = themeMap[type];
  const Icon = theme.icon;

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md group hover:border-white/20 transition-all duration-500">
      {/* Mini Entity Core */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: theme.glow }}
          animate={{ 
            scale: isBusy ? [1, 1.2, 1] : 1,
            opacity: isBusy ? [0.3, 0.6, 0.3] : 0.2
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <div className="relative z-10 w-8 h-8 rounded-lg bg-aether-black border border-white/10 flex items-center justify-center overflow-hidden">
          <Icon className="w-4 h-4" style={{ color: theme.color }} />
          {isBusy && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent h-2"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        
        {/* Synaptic Pulses */}
        {isBusy && (
          <div className="absolute -inset-2 pointer-events-none">
            {[0, 90, 180, 270].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: theme.color, left: '50%', top: '50%' }}
                animate={{ 
                  x: [0, Math.cos(angle * Math.PI / 180) * 20],
                  y: [0, Math.sin(angle * Math.PI / 180) * 20],
                  opacity: [1, 0]
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{theme.label}</span>
          {isBusy && (
            <span className="flex gap-0.5">
              <span className="w-0.5 h-0.5 rounded-full bg-aether-neon animate-bounce" />
              <span className="w-0.5 h-0.5 rounded-full bg-aether-neon animate-bounce delay-100" />
              <span className="w-0.5 h-0.5 rounded-full bg-aether-neon animate-bounce delay-200" />
            </span>
          )}
        </div>
        <p className="text-[10px] font-mono text-white/80 truncate uppercase tracking-tight">
          {status}
        </p>
      </div>

      <div className="px-2">
        <Activity className={`w-3 h-3 text-white/10 ${isBusy ? 'animate-pulse text-aether-neon/40' : ''}`} />
      </div>
    </div>
  );
}
