'use client';

import { useState, useEffect } from 'react';
import { useLiveAPI } from '../hooks/useLiveAPI';
import { WidgetRenderer } from './WidgetRenderer';
import { Mic, MicOff, Zap, Activity, Settings, Maximize2, User } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

type VoiceAgentProps = {
  activeAgent: any;
};

export function VoiceAgent({ activeAgent }: VoiceAgentProps) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<any>(null);
  const [agentState, setAgentState] = useState<'Disconnected' | 'Listening' | 'Thinking' | 'Speaking'>('Disconnected');

  const { isConnected, isRecording, logs, connect, disconnect, startRecording, stopRecording } = useLiveAPI(apiKey, (call) => {
    setActiveWidget(call);
    setAgentState('Thinking');
  });

  useEffect(() => {
    if (!isConnected) setAgentState('Disconnected');
    else if (isRecording) setAgentState('Listening');
    else setAgentState('Speaking');
  }, [isConnected, isRecording]);

  const toggleConnection = () => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      const tools: any[] = [];
      const functionDeclarations = [];

      if (activeAgent?.tools?.googleSearch) {
        tools.push({ googleSearch: {} });
      }
      
      if (activeAgent?.tools?.weather) {
        functionDeclarations.push({
          name: "getWeather",
          description: "Get the current weather for a location.",
          parameters: {
            type: "OBJECT",
            properties: {
              location: { type: "STRING", description: "The city and state, e.g. San Francisco, CA" }
            },
            required: ["location"]
          }
        });
      }

      if (activeAgent?.tools?.crypto) {
        functionDeclarations.push({
          name: "getCryptoPrice",
          description: "Get the current price of a cryptocurrency.",
          parameters: {
            type: "OBJECT",
            properties: {
              symbol: { type: "STRING", description: "The cryptocurrency symbol, e.g. BTC, ETH" }
            },
            required: ["symbol"]
          }
        });
      }

      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }
      
      connect(activeAgent?.systemPrompt, activeAgent?.voiceName, tools);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Top Bar / Status */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${agentState === 'Listening' ? 'shadow-[0_0_20px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400' : 'bg-white/5'}`}>
              {activeAgent?.seed ? (
                <Image 
                  src={`https://picsum.photos/seed/${activeAgent.seed}/100/100`}
                  alt={activeAgent.name}
                  fill
                  className="object-cover opacity-80 mix-blend-screen"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Zap className={`w-6 h-6 ${agentState === 'Thinking' ? 'animate-spin text-fuchsia-400' : 'text-cyan-400'}`} />
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A111C] border-2 border-[#0A111C] flex items-center justify-center z-10">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{activeAgent?.name || 'Neural Link'}</h2>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">{agentState}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleConnection}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
              isConnected 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isConnected}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
              !isConnected ? 'opacity-50 cursor-not-allowed bg-white/5 text-slate-500' :
              isRecording ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' : 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-cyan-500/20'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Activity & Logs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Activity Stream
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col-reverse">
              <div className="flex flex-col gap-3">
                {logs.length === 0 && (
                  <div className="text-xs font-mono text-slate-500">System initialized. Awaiting connection...</div>
                )}
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-mono ${
                      log.type === 'system' ? 'text-slate-500' :
                      log.type === 'user' ? 'text-emerald-400' :
                      log.type === 'tool' ? 'text-fuchsia-400' :
                      'text-cyan-400'
                    }`}
                  >
                    <span className="opacity-50 mr-2">[{log.timestamp}]</span>
                    {log.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Widget Arena */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden">
          {/* Subtle background gradient for the arena */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Dynamic Arena</h3>
            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative z-10">
            {activeWidget ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full"
              >
                <WidgetRenderer data={activeWidget} />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="w-24 h-24 rounded-full border border-dashed border-slate-600 flex items-center justify-center">
                  <Zap className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting Tool Execution</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
