'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Share2, Sparkles } from 'lucide-react';
import { Agent } from '@/lib/store/useGemigramStore';
import { installAgentAsPWA } from '@/lib/pwa/dynamic-manifest';
import { generateAgentAvatarUrl } from '@/lib/pwa/avatar-generator';

interface AddToHomeScreenProps {
  agent: Agent;
  userId: string;
  onClose: () => void;
}

export function AddToHomeScreen({ agent, userId, onClose }: AddToHomeScreenProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const avatarUrl = generateAgentAvatarUrl(agent.seed || agent.name || agent.id);
      const success = await installAgentAsPWA({
        agent,
        avatarUrl,
        userId,
      });
      
      if (success) {
        setInstallSuccess(true);
        // Show success for 2 seconds then close
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      console.error('[PWA] Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-24 left-4 right-4 z-[99] mx-auto max-w-md"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-gemigram-neon/30 bg-[#050B14]/80 backdrop-blur-2xl p-6 shadow-[0_0_50px_rgba(16,255,135,0.15)] ring-1 ring-white/10">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gemigram-neon/10 blur-[80px] rounded-full" />
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-5 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gemigram-neon to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={generateAgentAvatarUrl(agent.seed || agent.name || agent.id, 80)} 
              alt={agent.name}
              className="relative w-16 h-16 rounded-2xl border border-white/10 bg-black/40 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-gemigram-neon rounded-full p-1 border-2 border-[#050B14]">
              <Sparkles className="w-3 h-3 text-black" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-none mb-1">
              Deploy <span className="text-gemigram-neon">{agent.name}</span>
            </h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">{agent.role}</p>
          </div>
        </div>

        <div className="space-y-6">
          {installSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gemigram-neon/20 flex items-center justify-center mb-4 border border-gemigram-neon/30">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Download className="w-8 h-8 text-gemigram-neon" />
                </motion.div>
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Neural Link Established</h4>
              <p className="text-white/50 text-xs">The agent has been projected to your home screen.</p>
            </motion.div>
          ) : isIOS ? (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                <p className="text-white/80 text-sm font-medium">To install <span className="text-gemigram-neon font-bold">{agent.name}</span> on your iPhone:</p>
                <div className="grid gap-3 text-xs">
                  <div className="flex items-center gap-3 text-white/50 bg-black/20 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/80 font-bold border border-white/10">1</div>
                    <p>Tap the <Share2 className="inline w-4 h-4 mx-1 text-gemigram-neon" /> Share button in Safari</p>
                  </div>
                  <div className="flex items-center gap-3 text-white/50 bg-black/20 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/80 font-bold border border-white/10">2</div>
                    <p>Select "Add to Home Screen"</p>
                  </div>
                  <div className="flex items-center gap-3 text-white/50 bg-black/20 p-3 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/80 font-bold border border-white/10">3</div>
                    <p>Tap "Add" in the top right corner</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/50 text-xs text-center px-4 leading-relaxed">
                Add <span className="text-white font-bold">{agent.name}</span> as a standalone utility for zero-latency neural interaction.
              </p>
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="group relative w-full overflow-hidden rounded-2xl bg-gemigram-neon p-[1px] transition-all hover:shadow-[0_0_30px_rgba(16,255,135,0.25)] active:scale-[0.98] disabled:opacity-50"
              >
                <div className="relative flex items-center justify-center gap-3 bg-[#050B14] group-hover:bg-transparent py-4 rounded-[calc(1rem-1px)] transition-all">
                  {isInstalling ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gemigram-neon border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-gemigram-neon">Materializing...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-gemigram-neon group-hover:text-black transition-colors" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-gemigram-neon group-hover:text-black transition-colors">Add to Home Screen</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AddToHomeScreen;
