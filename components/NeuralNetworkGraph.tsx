'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function NeuralNetworkGraph() {
  const nodes = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 240 + 30,
    y: Math.random() * 120 + 30,
    size: Math.random() * 4 + 4
  })), []);

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 80) {
          lines.push({ from: nodes[i], to: nodes[j] });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative group hover:border-aether-neon/30 transition-all duration-500 overflow-hidden"
    >
      <div className="relative z-10 mb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mb-1">Gemigram Neural Net</h3>
        <div className="flex gap-4">
          <p className="text-[8px] font-mono text-aether-neon/60 uppercase">Nodes: 14.7B</p>
          <p className="text-[8px] font-mono text-aether-neon/60 uppercase">Latency: 2.1ms</p>
        </div>
      </div>

      <div className="relative h-40 w-full">
        <svg className="w-full h-full">
          {connections.map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="#00FF41"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 2, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
            />
          ))}
          {nodes.map((node, i) => (
            <React.Fragment key={`node-${i}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#00FF41"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                className="filter blur-[1px]"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size / 2}
                fill="white"
              />
            </React.Fragment>
          ))}
        </svg>
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-1 h-1 rounded-full bg-aether-neon animate-ping" />
        <span className="text-[6px] font-mono text-aether-neon uppercase tracking-widest">Active_Scan</span>
      </div>
    </motion.div>
  );
}
