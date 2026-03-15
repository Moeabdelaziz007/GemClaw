'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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

  // Gentle Parallax
  const x1 = useSpring(useTransform(mouseX, [0, windowSize.width], [10, -10]));
  const y1 = useSpring(useTransform(mouseY, [0, windowSize.height], [10, -10]));

  // Pre-calculate particles
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#020202] select-none pointer-events-none">
  
      {/* HUD Grid Layer */}
      <motion.div 
        style={{ 
          x: x1, 
          y: y1,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 255, 0.03) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(0, 242, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        className="absolute inset-[-5%] opacity-40 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_90%)]" 
      />

      {/* Neural Particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-aether-neon/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]"
            style={{ 
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{ 
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay
            }}
          />
        ))}
      </div>

      {/* Atmospheric Glows */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-aether-neon/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/5 blur-[120px] rounded-full" />

      {/* Scanner Line */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-aether-neon/[0.02] to-transparent h-[1px] w-full z-10"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
