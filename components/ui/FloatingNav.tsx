'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Settings, Plus, User, LogOut, Bell, Globe, Home, ChevronRight } from 'lucide-react';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { AetherLogo } from '@/components/AetherLogo';
import { useRouter } from 'next/navigation';

const ORBS_CONFIG = [
  {
    id: 'workspace',
    path: '/workspace',
    color: 'bg-aether-neon',
    shadow: 'shadow-[0_0_30px_rgba(0,242,255,0.4)]',
    icon: <LayoutDashboard className="w-5 h-5 text-white" />,
    position: 'top-8 left-8',
    label: 'Neural Workspace'
  },
  {
    id: 'hub',
    path: '/hub',
    color: 'bg-purple-500',
    shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    icon: <Users className="w-5 h-5 text-white" />,
    position: 'top-8 right-8',
    label: 'Agents Hub'
  },
  {
    id: 'settings',
    path: '/settings',
    color: 'bg-orange-500',
    shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]',
    icon: <Settings className="w-5 h-5 text-white" />,
    position: 'bottom-24 right-8',
    label: 'Config Matrix'
  },
  {
    id: 'forge',
    path: '/forge',
    color: 'bg-emerald-500',
    shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    icon: <Plus className="w-5 h-5 text-white" />,
    position: 'bottom-24 left-8',
    label: 'Aether Forge'
  },
  {
    id: 'galaxy',
    path: '/galaxy',
    color: 'bg-blue-500',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    icon: <Globe className="w-5 h-5 text-white" />,
    position: 'bottom-24 left-1/2 -translate-x-1/2',
    label: 'Aether Galaxy'
  }
];

interface FloatingNavProps {
  currentView: 'home' | 'workspace' | 'hub' | 'settings' | 'forge' | 'galaxy';
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export function FloatingNav({ currentView, user, onLogin, onLogout }: FloatingNavProps) {
  const [expandingOrb, setExpandingOrb] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnreadNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNavigate = (id: string, path: string) => {
    if (currentView === id) return;
    setExpandingOrb(id);
    setTimeout(() => {
      router.push(path);
      setTimeout(() => setExpandingOrb(null), 400);
    }, 400);
  };

  return (
    <>
      {/* Expanding Transition Overlay */}
      <AnimatePresence>
        {expandingOrb && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 200 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[100] w-10 h-10 rounded-full bg-aether-black/80 backdrop-blur-3xl pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transformOrigin: 'center' }}
          />
        )}
      </AnimatePresence>

      {/* Floating Orbs System */}
      <div className="fixed inset-0 pointer-events-none z-[90]">
        {ORBS_CONFIG.map((orb) => {
          const isActive = currentView === orb.id;
          const hasNotification = orb.id === 'workspace' && unreadNotifications.length > 0;

          return (
            <motion.div
              key={orb.id}
              className={`absolute ${orb.position} pointer-events-auto group`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                {/* Orbital Particle Visualizer */}
                <motion.div
                  className={`absolute -inset-4 border border-white/5 rounded-full`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNavigate(orb.id, orb.path)}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center quantum-glass aether-border transition-all duration-500 ${
                    isActive ? orb.shadow + ' border-white/40' : 'hover:border-white/30'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${orb.color}`} />
                  
                  <div className="relative z-10">
                    {hasNotification ? <Bell className="w-5 h-5 text-red-500 animate-bounce" /> : orb.icon}
                  </div>
                  
                  {hasNotification && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-aether-black flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">{unreadNotifications.length}</span>
                    </div>
                  )}
                </motion.button>

                {/* Tooltip */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${orb.position.includes('right') ? 'right-full mr-6' : 'left-full ml-6'} px-3 py-1.5 rounded-lg quantum-glass aether-border opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0`}>
                  <span className="text-[10px] uppercase tracking-widest font-black text-white/80">
                    {orb.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Sovereign Core (Central Home Orb) */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto group flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigate('home', '/dashboard')}
            className={`relative p-1 rounded-full quantum-glass aether-border transition-all duration-500 ${
              currentView === 'home' ? 'shadow-[0_0_40px_rgba(0,242,255,0.3)] border-aether-neon/50' : 'hover:border-aether-neon/30'
            }`}
          >
            <AetherLogo size={42} />
          </motion.button>
          
          <div className="mt-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-[8px] uppercase tracking-[0.3em] font-black text-aether-neon">Sovereign Core</span>
          </div>
        </motion.div>

        {/* User Intel Orb */}
        <motion.div
          className="absolute bottom-8 right-1/2 translate-x-1/2 pointer-events-auto group"
        >
          {user ? (
            <div className="flex items-center gap-4 px-2 py-2 rounded-full quantum-glass aether-border">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-aether-neon/50 transition-colors"
              >
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="User" 
                    fill
                    className="object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <User className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </motion.button>
              
              <div className="flex flex-col pr-4">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Identity</span>
                <span className="text-[11px] font-bold text-white/90 truncate max-w-[80px] leading-none">{user.displayName || 'Operator'}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="px-8 py-3 rounded-full bg-aether-neon text-black hover:bg-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group shadow-[0_10px_40px_rgba(0,242,255,0.3)] hover:shadow-white/20 border border-aether-neon/50"
            >
              Initialize Sync <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </>
  );
}
