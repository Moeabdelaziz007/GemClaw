"use client";

import { motion } from "framer-motion";

export const AetherLogo = ({ size = 48, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer Orbital Ring */}
      <motion.div
        className="absolute inset-0 border-2 border-aether-neon/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Pulsing Core */}
      <motion.div
        className="w-1/2 h-1/2 bg-gradient-to-br from-aether-neon to-aether-core rounded-full blur-[2px] shadow-[0_0_15px_rgba(0,242,255,0.6)]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cross-shimmer */}
      <motion.div
        className="absolute w-full h-[1px] bg-white/40 blur-[1px]"
        animate={{ rotate: [0, 180, 360], opacity: [0, 0.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
