'use client';

import { useWorkspaceLogic } from '@/lib/hooks/useWorkspaceLogic';
import { PureVoiceCanvas } from '@/components/workspace/PureVoiceCanvas';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkspacePage() {
  const { user, googleAccessToken, activeAgent, isLoading, hasError, errorDetails, router } = useWorkspaceLogic();

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-primary px-4 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
          <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
            <div className="absolute inset-0 rounded-full border-2 border-neon-green/20" />
            <div className="absolute inset-2 rounded-full border-2 border-neon-blue/30" />
            <div className="absolute inset-4 rounded-full border-2 border-electric-purple/40" />
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-neon-green"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-white/70">Initializing Neural Interface</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">Synchronizing Agent Matrix...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-theme-primary p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent p-6 glass-medium sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Neural Link Failure</h2>
          </div>
          <p className="mb-6 text-white/60">{errorDetails || 'Failed to initialize workspace environment.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-500/10 px-6 py-3 font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/20"
          >
            Reinitialize System
          </button>
        </motion.div>
      </div>
    );
  }

  if (!activeAgent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-8 w-8 text-gemigram-neon/40 animate-pulse" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Awaiting_Neural_Link...</p>
        </div>
      </div>
    );
  }

  // 🎙️ Pure Voice Canvas Integration
  return <PureVoiceCanvas activeAgent={activeAgent} />;
}
