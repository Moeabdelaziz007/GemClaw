import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingNav } from './ui/FloatingNav';
import { Flame, Sparkles, Cloud, Wifi, Battery, Signal, Zap } from 'lucide-react';
import { AetherLogo } from './AetherLogo';
import { ProjectSwitcher } from './ui/ProjectSwitcher';
import { useAuth } from './Providers';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, login, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentView = () => {
    if (pathname === '/' || pathname === '/dashboard') return 'home';
    if (pathname.includes('/workspace')) return 'workspace';
    if (pathname.includes('/hub')) return 'hub';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/forge')) return 'forge';
    if (pathname.includes('/galaxy')) return 'galaxy';
    return 'home';
  };

  const currentView = getCurrentView();

  const viewLabels: Record<string, string> = {
    home: 'Sovereign Core',
    workspace: 'Neural Workspace',
    hub: 'Context Hub',
    settings: 'Config Matrix',
    forge: 'Aether Forge',
    galaxy: 'Aether Galaxy'
  };

  return (
    <div className="flex flex-col h-screen w-full bg-aether-black text-white overflow-hidden selection:bg-aether-neon/30 font-sans">
      {/* iOS-Style Neural Status Bar */}
      <header className="fixed top-0 left-0 w-full z-[100] px-6 py-3 flex items-center justify-between quantum-glass border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AetherLogo size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Gemigram</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] font-bold text-aether-neon/80 uppercase tracking-widest animate-pulse">
            Neural Spine: Active
          </span>
          <div className="h-4 w-[1px] bg-white/10" />
          <ProjectSwitcher />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">Sector</span>
          <span className="text-[13px] font-bold text-white leading-none">{viewLabels[currentView]}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/40">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3 rotate-90" />
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[12px] font-mono font-bold tabular-nums text-white/90">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* Floating Dock Navigation */}
      <FloatingNav 
        currentView={currentView} 
        user={user}
        onLogin={login}
        onLogout={logout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden z-10 pt-14 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-32"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Industrial Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-6 z-50 pointer-events-none flex justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="px-6 py-2.5 rounded-full quantum-glass backdrop-blur-3xl border border-white/5 flex items-center gap-5 pointer-events-auto shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 pr-5 border-r border-white/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Infrastructure</span>
              <div className="flex items-center gap-3">
                <Flame className="w-3.5 h-3.5 text-orange-500/70" />
                <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
                <Cloud className="w-3.5 h-3.5 text-blue-400/70" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Gemigram Link</span>
              <span className="text-[10px] font-bold text-white/80">v2.1.0-UNIVERSAL</span>
            </div>

            <div className="flex items-center gap-2 pl-5 border-l border-white/10">
              <Zap className="w-3 h-3 text-aether-neon" />
              <span className="text-[9px] font-black uppercase tracking-widest text-aether-neon/80">Zero Friction</span>
            </div>
          </div>
          
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10">
            Automated Architecture by Antigravity AI
          </p>
        </div>
      </footer>
    </div>
  );
}
