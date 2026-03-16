'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export function LoadingSkeleton({ className = "", variant = 'rect' }: SkeletonProps) {
  return (
    <div className={`skeleton ${variant === 'circle' ? 'rounded-full' : 'rounded-lg'} ${className}`}>
      {/* HUD-style tech details inside skeleton */}
      <div className="absolute top-1 left-1 w-1 h-px bg-aether-neon/20" />
      <div className="absolute bottom-1 right-1 w-1 h-px bg-aether-neon/20" />
    </div>
  );
}

export function NeuralLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-12 h-12 border-2 border-aether-neon/30 border-t-aether-neon rounded-full"
      />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-hud text-aether-neon"
      >
        INITIALIZING_NEURAL_LINK...
      </motion.div>
    </div>
  );
}
