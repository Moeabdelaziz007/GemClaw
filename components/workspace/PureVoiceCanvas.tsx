'use client';

import { VoiceOrb } from './VoiceOrb';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { motion, AnimatePresence } from 'framer-motion';
import { WidgetRenderer } from '../WidgetRenderer';
import { Agent } from '@/lib/store/slices/createAgentSlice';

interface PureVoiceCanvasProps {
  activeAgent: Agent;
}

/**
 * 🎨 PureVoiceCanvas — The distraction-free interaction chamber.
 * Implements the "Zero-Friction" and "Voice-First" mandate.
 * Navigation is invisible, UI is strictly reactive.
 */
export function PureVoiceCanvas({ activeAgent }: PureVoiceCanvasProps) {
  const activeWidget = useGemigramStore((s) => s.sessionMetadata?.activeWidgets?.[0]); 
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] overflow-hidden">
      {/* 🚀 Background Textures (Low intensity to focus on Orb) */}
      <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-industrial opacity-[0.2] pointer-events-none" />

      {/* 🎙️ Primary Interaction Layer */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <VoiceOrb size={isMobile ? 120 : 160} />
        
        {/* Minimalist Agent Indicator (Subtle breathing text) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            {activeAgent.name}
          </span>
        </motion.div>
      </div>

      {/* 🛰️ Temporal Widget Layer (Manifests only when data is returned) */}
      <AnimatePresence>
        {activeWidget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="absolute bottom-24 z-20 w-full max-w-2xl px-6"
          >
            <div className="glass-medium rounded-[32px] border border-gemigram-neon/20 p-6 shadow-2xl">
              <WidgetRenderer data={activeWidget} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔒 Sovereignty Status HUD (Hidden Footer) */}
      <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 opacity-20">
          <div className="h-[1px] w-8 bg-white/20" />
          <span className="text-[8px] font-mono tracking-widest uppercase">Neural Link Established</span>
          <div className="h-[1px] w-8 bg-white/20" />
        </div>
      </div>
    </div>
  );
}
