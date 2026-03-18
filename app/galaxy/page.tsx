'use client';

import { useAetherStore } from '@/lib/store/useAetherStore';
import { Brain, ZoomIn, ZoomOut, Move, Network } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { BRAND } from '@/lib/constants/branding';

export default function GalaxyPage() {
  const { agents, setActiveAgentId, activeAgentId } = useAetherStore();
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [showConnections, setShowConnections] = useState(true);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const galaxySceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState({ width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    if (!galaxySceneRef.current) return;

    const updateSceneSize = () => {
      if (!galaxySceneRef.current) return;
      const { width, height } = galaxySceneRef.current.getBoundingClientRect();
      setSceneSize({ width, height });
    };

    updateSceneSize();
    const observer = new ResizeObserver(updateSceneSize);
    observer.observe(galaxySceneRef.current);

    return () => observer.disconnect();
  }, []);

  const getOrbitConfig = (index: number) => {
    const radius = 220 + index * 45;
    const duration = 25 + index * 6;
    const delay = index * -4;
    return { radius, duration, delay };
  };

  const getAgentProjectedPosition = (index: number) => {
    const { radius, duration, delay } = getOrbitConfig(index);
    const centerX = sceneSize.width / 2;
    const centerY = sceneSize.height / 2;
    const initialOffsetProgress = (-delay / duration) % 1;
    const angle = Math.PI + initialOffsetProgress * Math.PI * 2;
    const scaledRadius = radius * zoom;

    return {
      x: centerX + Math.cos(angle) * scaledRadius,
      y: centerY + Math.sin(angle) * scaledRadius,
    };
  };

  const startHintPress = (hint: string) => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setActiveHint(hint), 450);
  };

  const endHintPress = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setActiveHint(null);
  };

  useEffect(
    () => () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    },
    [],
  );

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="page-shell flex h-full min-h-[calc(100dvh-4rem)] flex-col gap-6 overflow-hidden py-4 sm:py-6 md:py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-col gap-4 rounded-[2rem] border border-white/10 glass-strong p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="relative z-20 max-w-3xl">
          <h2 className="page-title bg-gradient-to-r from-gemigram-neon via-white to-gemigram-neon bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">
            {BRAND.subProducts.galaxy}
          </h2>
          <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Sovereign Planet Architecture // Live Orchestration</p>
        </div>

        <div className="relative z-30 flex w-full flex-wrap gap-2 lg:w-auto lg:flex-col">
          {[
            { id: 'zoom-in', onClick: () => setZoom((z) => Math.min(z + 0.2, 2)), icon: ZoomIn, label: 'Zoom In' },
            { id: 'zoom-out', onClick: () => setZoom((z) => Math.max(z - 0.2, 0.6)), icon: ZoomOut, label: 'Zoom Out' },
            { id: 'connections', onClick: () => setShowConnections(!showConnections), icon: Network, label: showConnections ? 'Hide Connections' : 'Show Connections', active: showConnections },
          ].map((control) => (
            <div key={control.id} className="group relative flex">
              <button
                onClick={control.onClick}
                aria-label={control.label}
                title={control.label}
                onTouchStart={() => startHintPress(control.id)}
                onTouchEnd={endHintPress}
                onTouchCancel={endHintPress}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gemigram-neon focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 ${
                  control.active ? 'border-gemigram-neon/50 bg-gemigram-neon/10' : 'border-white/10 glass-medium hover:border-gemigram-neon/50 hover:bg-gemigram-neon/10'
                }`}
              >
                <control.icon className={`h-4 w-4 ${control.active ? 'text-gemigram-neon' : 'text-white/60 group-hover:text-gemigram-neon'}`} />
              </button>
              <span className={`invisible pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/85 px-2 py-1 text-[10px] uppercase tracking-wider text-white/80 opacity-0 transition-opacity duration-200 md:group-hover:visible md:group-hover:opacity-100 ${activeHint === control.id ? 'visible opacity-100' : ''}`}>
                {control.label}
              </span>
            </div>
          ))}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 quantum-glass">
            <Move className="h-4 w-4 text-white/40" />
          </div>
        </div>
      </motion.div>

      <div ref={galaxySceneRef} className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 p-4 sm:p-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,255,135,0.05)_0%,transparent_70%)]" />
          <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full bg-gradient-to-br from-gemigram-neon/5 to-transparent blur-[100px]" />
          <motion.div style={{ x: useTransform(parallaxX, (x) => -x * 0.5), y: useTransform(parallaxY, (y) => -y * 0.5) }} className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-gradient-to-tl from-gemigram-neon/5 to-transparent blur-[100px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI4MCIgcj0iMC41IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTIwIiByPSIwLjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-[length:200px_200px] bg-repeat opacity-30" />
        </div>

        <motion.div style={{ scale: zoom }} className="relative z-30 flex h-full items-center justify-center">
          <div className="group relative">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4], rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -inset-20 h-64 w-64 rounded-full bg-gradient-to-br from-gemigram-neon/20 via-neon-blue/10 to-transparent blur-[80px] mix-blend-screen"
            />
            <div className="relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gemigram-neon/60 bg-black/80 shadow-[0_0_120px_rgba(57,255,20,0.4),inset_0_0_50px_rgba(57,255,20,0.2)] transition-all duration-700 group-hover:scale-110 group-hover:border-gemigram-neon sm:h-24 sm:w-24">
              <motion.div
                animate={{ rotate: 360, boxShadow: ['0 0 30px rgba(57,255,20,0.3)', '0 0 80px rgba(57,255,20,0.6)', '0 0 30px rgba(57,255,20,0.3)'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-gemigram-neon/30"
              />
              <div className="absolute left-0 top-0 h-2 w-full animate-[scanline_2s_linear_infinite] bg-gemigram-neon/80 blur-sm opacity-50" />
              <Brain className="relative z-10 h-8 w-8 text-gemigram-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.8)] sm:h-10 sm:w-10" />
            </div>
            <div className="absolute left-1/2 top-full mt-4 -translate-x-1/2 rounded-full border border-gemigram-neon/20 bg-black/40 px-4 py-1.5 text-center shadow-[0_0_20px_rgba(57,255,20,0.1)] backdrop-blur-md">
              <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] font-black uppercase tracking-[0.32em] text-gemigram-neon">
                CORE_OS_ACTIVE
              </motion.div>
            </div>
          </div>
        </motion.div>

        {[200, 320, 450].map((r, i) => (
          <motion.div
            key={i}
            style={{ scale: zoom, width: r * 2, height: r * 2 }}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/5"
            initial={false}
            animate={{ x: '-50%', y: '-50%', borderColor: ['rgba(16,255,135,0.05)', 'rgba(255,255,255,0.02)', 'rgba(16,255,135,0.05)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        ))}

        {showConnections && agents.length > 1 && sceneSize.width > 0 && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${sceneSize.width} ${sceneSize.height}`}>
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(16,255,135,0)" />
                <stop offset="50%" stopColor="rgba(16,255,135,0.3)" />
                <stop offset="100%" stopColor="rgba(16,255,135,0)" />
              </linearGradient>
            </defs>
            {agents.map((_, i) => {
              const nextIndex = (i + 1) % agents.length;
              const centerX = sceneSize.width / 2;
              const centerY = sceneSize.height / 2;
              const currentPosition = getAgentProjectedPosition(i);
              const nextPosition = getAgentProjectedPosition(nextIndex);
              const connectToCore = i % 2 === 0;
              return (
                <g key={i}>
                  <line x1={currentPosition.x} y1={currentPosition.y} x2={nextPosition.x} y2={nextPosition.y} stroke="url(#connectionGradient)" strokeWidth="1" />
                  {connectToCore && <line x1={currentPosition.x} y1={currentPosition.y} x2={centerX} y2={centerY} stroke="rgba(16,255,135,0.12)" strokeWidth="1" strokeDasharray="4 6" />}
                </g>
              );
            })}
          </svg>
        )}

        {agents.map((agent, index) => {
          const { radius, duration, delay } = getOrbitConfig(index);
          const isActive = activeAgentId === agent.id;
          return (
            <motion.button
              key={agent.id}
              initial={false}
              animate={{ rotate: 360 }}
              transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
              className="absolute left-1/2 top-1/2 z-20 h-0 w-0"
              style={{ transformOrigin: 'center center' }}
              onClick={() => {
                setActiveAgentId(agent.id);
                router.push('/workspace');
              }}
            >
              <motion.div
                style={{ x: radius * zoom, y: 0 }}
                className={`flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center text-[10px] font-black uppercase tracking-[0.08em] shadow-lg transition-all sm:h-16 sm:w-16 ${
                  isActive ? 'border-gemigram-neon bg-gemigram-neon/20 text-gemigram-neon' : 'border-white/10 bg-black/70 text-white/70'
                }`}
              >
                <span className="line-clamp-2 max-w-[3.25rem]">{agent.name}</span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
