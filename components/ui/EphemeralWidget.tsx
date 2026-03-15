'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface EphemeralWidgetProps {
  children: ReactNode;
  className?: string;
}

export function EphemeralWidget({ children, className = '' }: EphemeralWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(10px)" }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className={`quantum-glass rounded-3xl p-6 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
