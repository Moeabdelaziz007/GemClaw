'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Gentle Ambient Movement
  const x1 = useSpring(useTransform(mouseX, [0, windowSize.width], [30, -30]));
  const y1 = useSpring(useTransform(mouseY, [0, windowSize.height], [30, -30]));
  const rotateX = useSpring(useTransform(mouseY, [0, windowSize.height], [5, -5]));
  const rotateY = useSpring(useTransform(mouseX, [0, windowSize.width], [-5, 5]));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] select-none pointer-events-none">
      {/* HUD Grid Layer */}
      <motion.div 
        style={{ 
          perspective: 1000,
          rotateX,
          rotateY,
        }}
        className="absolute inset-0 flex items-center justify-center opacity-20"
      >
        <div 
          className="absolute inset-[-50%] hud-grid"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 255, 65, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
      </motion.div>

      {/* Dynamic Glow Blobs */}
      <motion.div 
        style={{ x: x1, y: y1 }}
        className="absolute inset-[-10%] opacity-30"
      >
        <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-aether-neon/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[35vw] h-[35vw] bg-emerald-500/5 rounded-full blur-[120px]" />
      </motion.div>

      {/* Digital Rain / Scanlines Area */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 scanline" />
      </div>

      {/* Interactive Flash Overlay */}
      <motion.div
        animate={{ 
          opacity: [0, 0.05, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          times: [0, 0.5, 1] 
        }}
        className="absolute inset-0 bg-aether-neon pointer-events-none"
      />

      {/* Surface Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)" />
    </div>
  );
}
