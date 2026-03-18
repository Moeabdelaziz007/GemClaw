'use client';

import { useVoiceAgentLogic } from '@/lib/hooks/useVoiceAgentLogic';
import { useAetherStore, Agent } from '../lib/store/useAetherStore';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Activity, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { SovereignDashboard } from './SovereignDashboard';

export function VoiceAgent({ activeAgent, googleAccessToken }: { activeAgent: Agent; googleAccessToken?: string }) {
  const setVoiceSession = useAetherStore((state) => state.setVoiceSession);

  const {
    isConnected,
    isRecording,
    logs,
    volume,
    agentStatus,
    activeWidget,
    transcript,
    linkType,
    showLogs,
    toggleConnection,
    startRecording,
    stopRecording,
  } = useVoiceAgentLogic({ activeAgent, googleAccessToken });

  useEffect(() => {
    setVoiceSession({
      stage: 'workspace',
      lastVoiceAction: isConnected
        ? isRecording
          ? 'You are live. Keep speaking naturally.'
          : 'Tap the mic to start your next voice turn.'
        : 'Use Establish Link to reconnect your voice channel.',
    });
  }, [isConnected, isRecording, setVoiceSession]);

  const voiceActionPrompt = useMemo(() => {
    if (!isConnected) return 'Voice link is offline. Re-establish to continue voice-first flow.';
    if (isRecording) return 'Listening now. Share your request in one sentence.';
    return 'Connection is active. Tap mic for your next voice action.';
  }, [isConnected, isRecording]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#030303] pb-nav-safe">
      <SovereignDashboard
        activeAgent={activeAgent}
        volume={volume}
        status={agentStatus}
        linkType={linkType}
        transcript={transcript}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(8rem+var(--safe-area-bottom))] z-[105] px-4 sm:bottom-[calc(8.5rem+var(--safe-area-bottom))] sm:px-6 lg:bottom-28">
        <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-white/15 glass-medium px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gemigram-neon/80">Voice Link Status · {agentStatus}</p>
            <p className="text-sm text-white/85">{voiceActionPrompt}</p>
          </div>
          {!isConnected && (
            <button
              onClick={toggleConnection}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gemigram-neon/30 bg-gemigram-neon/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gemigram-neon"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Re-establish voice link
            </button>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(1rem+var(--safe-area-bottom))] z-[100] px-4 sm:px-6 lg:bottom-6">
        <div className="pointer-events-auto mx-auto flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleConnection}
            className={`min-h-[52px] rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all ${
              isConnected
                ? 'border border-red-500/30 bg-red-500/20 text-red-500'
                : 'border border-gemigram-neon/30 bg-gemigram-neon/20 text-gemigram-neon'
            }`}
          >
            {isConnected ? 'Kill_Link' : 'Establish_Link'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => (isRecording ? stopRecording() : startRecording())}
            disabled={!isConnected}
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl transition-all sm:mx-0 ${
              !isConnected
                ? 'bg-white/5 text-white/20'
                : isRecording
                  ? 'animate-pulse bg-red-500 text-white'
                  : 'border border-white/10 bg-white/10 text-white'
            }`}
          >
            {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {activeWidget && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[calc(10.5rem+var(--safe-area-bottom))] z-[110] flex justify-center px-4 sm:px-6 lg:bottom-40">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="pointer-events-auto w-full max-w-2xl rounded-[28px] border border-gemigram-neon/30 p-5 shadow-2xl sovereign-glass sm:p-6 md:p-8"
            >
              <WidgetRenderer data={activeWidget} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute inset-y-0 left-0 z-20 flex w-full max-w-[20rem] flex-col border-r border-white/10 p-4 quantum-glass sm:p-6 md:p-8"
          >
            <h3 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 sm:mb-8">
              <Activity className="h-4 w-4" /> Neural Logs
            </h3>
            <div className="custom-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`text-[10px] font-mono leading-relaxed ${
                      log.type === 'system'
                        ? 'text-slate-500'
                        : log.type === 'user'
                          ? 'text-emerald-400'
                          : log.type === 'tool'
                            ? 'text-fuchsia-400'
                            : 'text-cyan-400'
                    }`}
                  >
                    <span className="mr-2 opacity-30">[{log.timestamp}]</span>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
