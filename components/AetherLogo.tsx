"use client";

import { motion } from "framer-motion";

export const GemigramLogo = ({ size = 48, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Neural Core Glow */}
      <motion.div
        className="absolute inset-0 bg-aether-neon/10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <svg 
        viewBox="0 0 100 100" 
        className="relative z-10 w-full h-full fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagonal Lattice (Background) */}
        <path
          d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />

        {/* Outer Sovereign Hexagon */}
        <motion.path
          d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
          stroke="url(#aether-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* The Neural 'G' (Conceptualized as an open circuit) */}
        <motion.path
          d="M68 32 C62 25 50 22 40 28 C28 35 24 50 24 60 C24 75 35 82 50 82 C65 82 72 70 72 55 L50 55"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
        />

        {/* Data Pulses on the 'G' */}
        <motion.circle
          r="2"
          fill="#00ff41"
          animate={{
            cx: [68, 40, 24, 50, 72, 50],
            cy: [32, 28, 60, 82, 55, 55],
            opacity: [0, 1, 1, 1, 1, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Neural Terminal Nodes */}
        {[
          { x: 50, y: 5 }, { x: 89, y: 27.5 }, { x: 89, y: 72.5 }, 
          { x: 50, y: 95 }, { x: 11, y: 72.5 }, { x: 11, y: 27.5 }
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="1.5"
            fill={i % 2 === 0 ? "#00ff41" : "#10b981"}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
          />
        ))}

        <defs>
          <linearGradient id="aether-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff41" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// Backwards compatibility export
export const AetherLogo = GemigramLogo;
