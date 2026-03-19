'use client';

import { motion, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';

interface VoiceOrbProps {
  size?: number;
}

/**
 * 🎙️ VoiceOrb — The heart of Gemigram AIOS.
 * A high-fidelity, reactive orb that scales with microphone input
 * and changes color based on agent cognitive states.
 */
export function VoiceOrb({ size = 160 }: VoiceOrbProps) {
  // 1. Precise Zustand Selectors (Minimize re-renders)
  const micLevel = useGemigramStore((s) => s.micLevel);
  const isSpeaking = useGemigramStore((s) => s.isSpeaking);
  const isThinking = useGemigramStore((s) => s.isThinking);
  const isInterrupted = useGemigramStore((s) => s.isInterrupted);

  // 2. Spring-driven Scaling (Zero-latency visual feel)
  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 };
  const scaleSpring = useSpring(1, springConfig);

  useEffect(() => {
    // Scaling formula: base 1.0 + level * sensitivity
    // Max scale capped at roughly 1.4 for visual balance
    const targetScale = 1 + Math.min(micLevel * 0.8, 0.4);
    scaleSpring.set(targetScale);
  }, [micLevel, scaleSpring]);

  // 3. Status Mapping
  const getStatusColor = () => {
    if (isInterrupted) return 'rgba(239, 68, 68, 0.4)'; // Red pulse for interruption
    if (isSpeaking) return '#00FFC2'; // Mint Teal for AI output
    if (isThinking || micLevel > 0.05) return '#39FF14'; // Neon Green for User input / Reasoning
    return 'rgba(57, 255, 20, 0.2)'; // Idle glow
  };

  const statusColor = getStatusColor();

  return (
    <div className="relative flex items-center justify-center">
      {/* 🔮 Outer Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute rounded-full blur-[64px]"
        style={{
          width: size * 2.5,
          height: size * 2.5,
          background: `radial-gradient(circle, ${statusColor} 0%, transparent 70%)`,
        }}
      />

      {/* 🧬 Secondary "Breath" Pulse */}
      <motion.div
        animate={{
          scale: isThinking || isSpeaking ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-[8px]"
        style={{
          width: size * 1.4,
          height: size * 1.4,
        }}
      />

      {/* 🎙️ Core Reactive Orb */}
      <motion.div
        style={{
          width: size,
          height: size,
          scale: scaleSpring,
          backgroundColor: statusColor,
          boxShadow: `0 0 60px ${statusColor}40, inset 0 0 20px rgba(255,255,255,0.2)`,
        }}
        className="relative rounded-full border border-white/20 transition-colors duration-500"
      >
        {/* Intrinsic Detail: Shimmer effect when active */}
        {(isSpeaking || isThinking) && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
