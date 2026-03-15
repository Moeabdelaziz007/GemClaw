import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, LayoutDashboard, Users, Settings, Plus, LogOut, User } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  currentView: 'home' | 'workspace' | 'hub' | 'settings' | 'forge';
  onNavigate: (view: 'home' | 'workspace' | 'hub' | 'settings' | 'forge') => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AppShell({ children, currentView, onNavigate, user, onLogin, onLogout }: AppShellProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workspace', label: 'Workspace', icon: LayoutDashboard },
    { id: 'hub', label: 'Agents Hub', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen w-full bg-[#030303] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      {/* Sidebar (Glassmorphism) */}
      <nav className="w-20 lg:w-64 h-full border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col justify-between py-8 z-50 transition-all duration-300">
        <div className="flex flex-col items-center lg:items-start px-0 lg:px-8">
          {/* Logo */}
          <div className="mb-12 flex items-center justify-center lg:justify-start w-full cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <span className="font-bold text-xl tracking-tighter">G</span>
            </div>
            <span className="hidden lg:block ml-4 font-bold text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              GEMIGRAM
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-4 w-full px-4 lg:px-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center justify-center lg:justify-start gap-4 p-3 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/10 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-2xl border border-cyan-400/30 bg-cyan-400/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Icon className={`w-6 h-6 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden lg:block font-medium relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section (User & Forge) */}
        <div className="flex flex-col items-center lg:items-stretch gap-4 px-4 lg:px-8 w-full">
          <button 
            onClick={() => onNavigate('forge')}
            className="relative w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Plus className="w-6 h-6 relative z-10" />
            <span className="hidden lg:block relative z-10 tracking-wider">AETHER FORGE</span>
          </button>

          <div className="w-full h-[1px] bg-white/10 my-2" />

          {user ? (
            <div className="flex items-center justify-center lg:justify-between w-full p-2 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">{user.displayName || 'User'}</span>
                  <span className="text-xs text-slate-400 truncate max-w-[120px]">{user.email}</span>
                </div>
              </div>
              <button onClick={onLogout} className="hidden lg:block p-2 text-slate-400 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={onLogin} className="w-full p-3 rounded-2xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all font-medium">
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full overflow-y-auto overflow-x-hidden"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
