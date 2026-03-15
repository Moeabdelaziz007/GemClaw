'use client';

import { useState, useEffect } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { User, Play, Mic, MicOff, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import CreateAgentForm from '@/components/CreateAgentForm';

const INITIAL_AGENTS = [
  { id: 'atlas', name: 'Atlas', role: 'AI Companion', users: '5K', seed: 'cyborg', systemPrompt: 'You are Atlas, a helpful AI companion.', voiceName: 'Zephyr' },
  { id: 'nova', name: 'Nova', role: 'Creative Guide', users: '179', seed: 'android', systemPrompt: 'You are Nova, a creative guide.', voiceName: 'Kore' },
  { id: 'orion', name: 'Orion', role: 'Creative Guide', users: '12K', seed: 'mecha', systemPrompt: 'You are Orion, a creative guide.', voiceName: 'Charon' },
  { id: 'lyra', name: 'Lyra', role: 'Creative Guide', users: '8K', seed: 'hologram', systemPrompt: 'You are Lyra, a creative guide.', voiceName: 'Puck' },
  { id: 'kora', name: 'Kora', role: 'AI Companion', users: '131', seed: 'synth', systemPrompt: 'You are Kora, an AI companion.', voiceName: 'Fenrir' },
];

export default function Gemigram() {
  const { isConnected, isRecording, error, connect, disconnect } = useLiveAPI();
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState('atlas');
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect(activeAgent.systemPrompt, activeAgent.voiceName);
    }
  };

  const handleCreateAgent = (data: { name: string; description: string; systemPrompt: string; voiceName: string }) => {
    const newAgent = {
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      role: data.description,
      users: '0',
      seed: data.name.toLowerCase(),
      systemPrompt: data.systemPrompt,
      voiceName: data.voiceName,
    };
    setAgents([newAgent, ...agents]);
    setActiveAgentId(newAgent.id);
    setIsCreatingAgent(false);
  };

  // Disconnect when switching agents
  useEffect(() => {
    if (isConnected) {
      disconnect();
    }
  }, [activeAgentId, isConnected, disconnect]);

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden relative flex flex-col items-center py-8 px-4 sm:px-8">
      
      {/* Background ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-[#0A111C]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden relative z-10">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-400">
            GEMIGRAM
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button className="hover:text-cyan-400 transition-colors">Discover</button>
            <button className="hover:text-cyan-400 transition-colors">Create</button>
            <button className="hover:text-cyan-400 transition-colors">Hub</button>
            <button className="hover:text-cyan-400 transition-colors">Login</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-[#0A111C] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center pt-16 pb-12 px-4 relative">
          
          {/* Glowing Orb */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center">
            {/* Outer dashed ring */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed opacity-50"
            />
            {/* Middle solid ring */}
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-fuchsia-500/20"
            />
            {/* Inner complex ring */}
            <motion.div 
              animate={{ rotate: 360, scale: isConnected ? [1, 1.05, 1] : 1 }} 
              transition={{ duration: isConnected ? 2 : 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            />
            {/* Core Glow */}
            <motion.div 
              animate={{ 
                scale: isConnected ? [1, 1.2, 1] : [1, 1.05, 1],
                opacity: isConnected ? [0.8, 1, 0.8] : [0.5, 0.7, 0.5]
              }}
              transition={{ duration: isConnected ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-fuchsia-500 to-cyan-400 rounded-full blur-md"
            />
            {/* Core Solid */}
            <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center">
              {isConnected ? (
                <Mic className="w-8 h-8 text-cyan-600 animate-pulse" />
              ) : (
                <div className="w-4 h-4 bg-cyan-200 rounded-full shadow-[0_0_20px_rgba(34,211,238,1)]" />
              )}
            </div>
            
            {/* Decorative lines */}
            <div className="absolute top-1/2 -left-32 w-32 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50" />
            <div className="absolute top-1/2 -right-32 w-32 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400 mb-4 text-center">
            GEMIGRAM
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide mb-10 text-center">
            The Voice-Native AI Social Nexus.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={toggleConnection}
              className={`relative group px-10 py-3 rounded-full font-semibold tracking-widest uppercase transition-all duration-300 ${
                isConnected 
                  ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.4)]' 
                  : 'bg-transparent text-fuchsia-400 hover:bg-fuchsia-500/10 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]'
              }`}
            >
              <div className="absolute inset-0 rounded-full border border-fuchsia-500/50 group-hover:border-fuchsia-400 transition-colors" />
              {isConnected ? 'DISCONNECT' : 'CONNECT NOW'}
            </button>
            <button 
              onClick={() => setIsCreatingAgent(true)}
              className="text-cyan-400 font-medium tracking-widest uppercase text-sm hover:text-cyan-300 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-cyan-400/50 hover:after:bg-cyan-300"
            >
              CREATE AGENT
            </button>
          </div>
          
          {error && (
            <div className="mt-6 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {/* Agent Hive Section */}
        <div className="px-8 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">AGENT HIVE</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>

          <div className="flex overflow-x-auto pb-6 gap-4 snap-x hide-scrollbar">
            {agents.map((agent) => (
              <button 
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={`min-w-[160px] md:min-w-[180px] p-[1px] rounded-2xl snap-start transition-all duration-300 text-left ${
                  activeAgentId === agent.id 
                    ? 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="bg-[#0A111C] rounded-2xl p-3 h-full flex flex-col">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                    <Image 
                      src={`https://picsum.photos/seed/${agent.seed}/200/200`}
                      alt={agent.name}
                      fill
                      className="object-cover opacity-80 mix-blend-screen"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A111C] to-transparent opacity-60" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {agent.users}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{agent.role}</p>
                  
                  <div className="mt-auto flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-lg w-fit border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeAgentId === agent.id && isConnected ? 'bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,1)]' : 'bg-emerald-500'}`} />
                    <span className={`text-[10px] font-medium ${activeAgentId === agent.id && isConnected ? 'text-cyan-400' : 'text-emerald-500'}`}>
                      {activeAgentId === agent.id && isConnected ? 'Listening' : 'Voice Online'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Synthesis Section */}
        <div className="px-8 pb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-bold tracking-widest text-fuchsia-400 uppercase">VOICE SYNTHESIS</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-fuchsia-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Waveform Visualizer */}
            <div className="bg-[#0D1522] border border-white/5 rounded-2xl p-6 relative overflow-hidden h-48 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              
              {/* Simulated Waveform using motion divs */}
              <div className="flex items-center gap-1 h-24 z-10">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: isConnected 
                        ? [Math.abs(Math.sin(i * 1.1)) * 20 + 10, Math.abs(Math.sin(i * 1.3)) * 80 + 20, Math.abs(Math.sin(i * 1.5)) * 20 + 10] 
                        : 4 
                    }}
                    transition={{ 
                      duration: 0.5 + Math.abs(Math.sin(i * 1.7)) * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className={`w-1.5 rounded-full ${
                      i % 3 === 0 ? 'bg-cyan-400' : i % 2 === 0 ? 'bg-fuchsia-500' : 'bg-purple-400'
                    } shadow-[0_0_10px_currentColor]`}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#0D1522] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {['Tone', 'Resonance', 'Style', 'Pitch'].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">{label}</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full relative">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${idx % 2 === 0 ? 'bg-fuchsia-500' : 'bg-cyan-400'}`} 
                        style={{ width: `${60 + (idx * 10)}%` }} 
                      />
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
                        style={{ left: `calc(${60 + (idx * 10)}% - 6px)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0A111C] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 mb-2">Processing Voice: Hyper-realistic Output...</span>
                  {/* Mini waveform */}
                  <div className="flex items-center gap-0.5 h-4">
                    {[...Array(40)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-0.5 rounded-full ${i < 20 ? 'bg-cyan-400' : 'bg-fuchsia-500'}`}
                        style={{ height: `${Math.abs(Math.sin(i * 1.1)) * 100}%`, opacity: 0.5 + Math.abs(Math.sin(i * 1.3)) * 0.5 }}
                      />
                    ))}
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 text-[#0A111C] fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Global CSS for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Create Agent Modal */}
      {isCreatingAgent && (
        <CreateAgentForm 
          onClose={() => setIsCreatingAgent(false)} 
          onSubmit={handleCreateAgent} 
        />
      )}
    </div>
  );
}
