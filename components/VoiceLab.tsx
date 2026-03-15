'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Activity, Save, Play, 
  Trash2, Sliders, ChevronLeft,
  Wand2, Brain, Fingerprint, Pulse,
  Layers, Volume2, Music, Settings
} from 'lucide-react';
import { useAetherStore } from '../lib/store/useAetherStore';

interface VoiceLabProps {
  onBack?: () => void;
}

export default function VoiceLab({ onBack }: VoiceLabProps) {
  const { voiceProfile, setVoiceProfile } = useAetherStore();
  const [activeTab, setActiveTab] = useState<'blueprint' | 'tuning' | 'library'>('blueprint');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Frequency wave simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
      setAudioLevel(0);
    };
  }, [isRecording]);

  const stats = [
    { label: 'Phonemes', value: '8,452/9,600', progress: 88 },
    { label: 'Vocal Range', value: '94%', progress: 94 },
    { label: 'Intonation', value: 'Analyzing', progress: 65 },
    { label: 'Accuracy', value: '89.1%', progress: 89 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HUD Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-aether-neon" />
              <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white">Neural Voice Lab</h1>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-1">
              Status: {voiceProfile.sampleStatus === 'ready' ? 'Neural Link Ready' : 'Synthesizing Blueprint'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {['blueprint', 'tuning', 'library'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeTab === tab 
                    ? 'bg-aether-neon/20 border-aether-neon text-aether-neon' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Lab Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="quantum-glass p-8 border border-white/5 rounded-[40px] relative overflow-hidden group min-h-[500px] flex flex-col items-center justify-center">
             <div className="absolute inset-0 bg-aether-neon/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
             
             {/* DNA / Brain Visualizer Placeholder */}
             <div className="relative w-full aspect-video flex items-center justify-center mb-12">
                <AnimatePresence>
                  {isRecording && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-64 h-64 rounded-full border border-aether-neon/20 animate-ping" />
                      <div className="absolute w-48 h-48 rounded-full border border-aether-neon/40 animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end gap-1.5 h-32 relative z-10">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isRecording 
                          ? [
                              `${20 + (i * 17) % 60}%`, 
                              `${10 + (i * 23) % 40}%`, 
                              `${30 + (i * 11) % 50}%`
                            ]
                          : '15%'
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity,
                        repeatType: 'mirror',
                        delay: i * 0.02
                      }}
                      className={`w-1 rounded-full transition-colors duration-500 ${
                        isRecording ? 'bg-aether-neon' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Central Status Node */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`absolute w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 transition-all duration-500 ${
                    isRecording 
                      ? 'bg-aether-neon border-aether-neon shadow-[0_0_30px_rgba(0,255,255,0.4)]' 
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <Fingerprint className={`w-8 h-8 ${isRecording ? 'text-black' : 'text-white/20'}`} />
                </motion.div>
             </div>

             <div className="text-center space-y-4 relative z-10">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                  {isRecording ? 'Streaming Neural Frequencies' : 'Voice DNA Capture'}
                </h3>
                <p className="text-white/40 text-xs font-mono max-w-md mx-auto">
                  {isRecording 
                    ? 'Maintain a consistent tone. Extracting spectral characteristics and emotional resonance coefficients...' 
                    : 'Initialize capture to build your neural voice profile. For best results, speak clearly for 30 seconds.'}
                </p>
                
                <div className="flex items-center justify-center gap-4 pt-4">
                  <motion.button
                    onClick={() => setIsRecording(!isRecording)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                      isRecording 
                        ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' 
                        : 'bg-white text-black hover:bg-aether-neon'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Stop Capture' : 'Start Capture'}
                  </motion.button>
                  
                  <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                    Reset Sample
                  </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="quantum-glass p-4 border border-white/5 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{s.label}</p>
                <p className="text-sm font-bold text-white mb-3">{s.value}</p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    className="h-full bg-aether-neon shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="quantum-glass p-6 border border-white/5 rounded-[32px] space-y-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-aether-neon" />
              Tuning Parameters
            </h2>

            <div className="space-y-6">
               {[
                 { label: 'Neural Pitch', value: 1.05, icon: Music },
                 { label: 'Speech Rate', value: 0.98, icon: Activity },
                 { label: 'Synthesizer Volume', value: 1.2, icon: Volume2 },
                 { label: 'Echo Cancellation', value: 'Enabled', icon: ShieldCheck },
               ].map((param) => (
                 <div key={param.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <param.icon className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-[10px] font-bold text-white/60 uppercase">{param.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-aether-neon">{param.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full relative group cursor-pointer">
                       <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="h-full bg-white/20 rounded-full w-1/2 group-hover:bg-aether-neon transition-all" />
                    </div>
                 </div>
               ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
               <button className="w-full py-4 rounded-xl bg-aether-neon text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                 <Wand2 className="w-4 h-4" />
                 Optimize Voice
               </button>
               <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                 Save to Library
               </button>
            </div>
          </div>

          <div className="quantum-glass p-6 border border-white/5 rounded-[32px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
                <Music className="w-4 h-4 text-fuchsia-400" />
                Active Blueprint
              </h2>
              <span className="text-[8px] font-mono text-white/20 uppercase">AETHER-v9.4</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group cursor-pointer hover:border-aether-neon/30 transition-all">
               <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 group-hover:bg-aether-neon/10 group-hover:border-aether-neon/30">
                 <Play className="w-4 h-4 text-fuchsia-400 group-hover:text-aether-neon" />
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-white uppercase">Corporate Male (US)</p>
                 <p className="text-[8px] font-mono text-white/20 uppercase">12.4 MB // Neural Studio</p>
               </div>
               <Settings className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
