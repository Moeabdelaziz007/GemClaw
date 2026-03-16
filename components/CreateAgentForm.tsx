'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  X, ChevronRight, Globe, Map, Mail, Calendar, 
  FileText, Code, Database, Brain, Cpu, Zap, 
  Activity, ShieldCheck, Sparkles, Binary, 
  Fingerprint, Command, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MiniAgentHUD from './MiniAgentHUD';
import { ASTRAEUS_PERSONA, getAstraeusInsight } from '../lib/persona/AstraeusCore';

const CORE_PRESETS = [
  { id: 'atlas', name: 'Atlas', role: 'AI Companion', systemPrompt: 'You are Atlas, a helpful AI companion.', voiceName: 'Zephyr' },
  { id: 'nova', name: 'Nova', role: 'Creative Guide', systemPrompt: 'You are Nova, a creative guide.', voiceName: 'Kore' },
  { id: 'orion', name: 'Orion', role: 'Creative Guide', systemPrompt: 'You are Orion, a creative guide.', voiceName: 'Charon' },
  { id: 'lyra', name: 'Lyra', role: 'Creative Guide', systemPrompt: 'You are Lyra, a creative guide.', voiceName: 'Puck' },
];

type AgentFormData = {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  memory: string;
  skills_desc: string;
  soul: string;
  rules: string;
  computeTier: 'Standard' | 'Neural' | 'Aether';
  tools: {
    googleSearch: boolean;
    googleMaps: boolean;
    weather: boolean;
    news: boolean;
    crypto: boolean;
    calculator: boolean;
    semanticMemory: boolean;
  };
  skills: {
    gmail: boolean;
    calendar: boolean;
    drive: boolean;
  };
};

const AVAILABLE_VOICES = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
const COMPUTE_TIERS = [
  { id: 'Standard', label: 'Standard', icon: Cpu, desc: 'Base logic processing', color: 'text-slate-400' },
  { id: 'Neural', label: 'Neural', icon: Brain, desc: 'Advanced reasoning + GWS', color: 'text-cyan-400' },
  { id: 'Aether', label: 'Aether', icon: Zap, desc: 'Omni-modal ultra-latency', color: 'text-fuchsia-400' },
];

interface CreateAgentFormProps {
  onClose: () => void;
  onSubmit: (data: AgentFormData) => void;
}

export default function CreateAgentForm({ onClose, onSubmit }: CreateAgentFormProps) {
  const [step, setStep] = useState(1);
  const [forgeLogs, setForgeLogs] = useState<string[]>(['INITIALIZING_FORGE_CHAMBER...', 'SYNCING_NEURAL_WEIGHTS...']);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AgentFormData>({
    defaultValues: {
      voiceName: 'Zephyr',
      computeTier: 'Neural',
      memory: 'No prior memory initialized.',
      skills_desc: 'General assistance and conversation.',
      soul: 'Curious and empathetic.',
      rules: 'Be helpful, harmless, and honest.',
      tools: {
        googleSearch: false,
        googleMaps: false,
        weather: false,
        news: false,
        crypto: false,
        calculator: false,
        semanticMemory: false,
      },
      skills: {
        gmail: false,
        calendar: false,
        drive: false,
      },
    },
  });

  const selectedVoice = watch('voiceName');
  const selectedTier = watch('computeTier');

  const nextStep = () => {
    setStep(s => {
      const next = Math.min(s + 1, 3);
      if (next === 2) setForgeLogs(prev => [...prev.slice(-4), 'MAPPING_COGNITIVE_TRANSFORMS...', 'INJECTING_PERSONA_SCHEMA...']);
      if (next === 3) setForgeLogs(prev => [...prev.slice(-4), 'ESTABLISHING_Synaptic_Bridges...', 'LINKING_ADK_CONTEXT...']);
      return next;
    });
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aether-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#03070C] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Animated Forge Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-aether-neon/50 to-transparent" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-aether-neon/5 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-fuchsia-500/5 blur-[100px] rounded-full" />

        {/* Forge Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 z-10 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-[0.3em] uppercase text-white flex items-center gap-4 neural-flicker">
              <Binary className="w-6 h-6 text-aether-neon animate-pulse" />
              Sovereign Genesis
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-aether-neon animate-pulse" />
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                {ASTRAEUS_PERSONA.designation} • {ASTRAEUS_PERSONA.age} • STATUS::SOVEREIGN
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
          >
            <X className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="px-10 py-6 grid grid-cols-3 gap-6 shrink-0 border-b border-white/5 bg-white/[0.01] relative">
          <div className="absolute bottom-0 left-0 h-px bg-aether-neon/20 w-full overflow-hidden">
            <motion.div 
              className="h-full bg-aether-neon"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ width: '30%' }}
            />
          </div>
          {[
            { id: 1, label: 'Bio-Identity', icon: Fingerprint },
            { id: 2, label: 'Neural Matrix', icon: Brain },
            { id: 3, label: 'Synaptic Links', icon: Zap }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-4 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-700 ${
                step >= s.id ? 'bg-aether-neon/10 border-aether-neon/40 text-aether-neon shadow-[0_0_20px_rgba(0,255,65,0.2)]' : 'bg-white/5 border-white/10 text-white/20'
              }`}>
                <s.icon className={`w-5 h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
              </div>
              <div className="hidden md:block flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${step >= s.id ? 'text-white' : 'text-white/20'}`}>
                    {s.label}
                  </span>
                  {step > s.id && <ShieldCheck className="w-3 h-3 text-aether-neon" />}
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: step >= s.id ? '100%' : '0%' }}
                    className={`h-full ${step > s.id ? 'bg-aether-neon' : 'bg-aether-neon/40'} shadow-[0_0_10px_rgba(0,255,65,0.5)]`}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preset Core Selection */}
        {step === 1 && (
          <div className="px-10 pt-6 flex items-center justify-between shrink-0">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {CORE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setValue('name', preset.name);
                    setValue('description', preset.role);
                    setValue('systemPrompt', preset.systemPrompt);
                    setValue('voiceName', preset.voiceName);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-aether-neon/30 transition-all group/preset shrink-0"
                >
                  <div className="w-6 h-6 rounded-lg bg-aether-neon/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-aether-neon" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/preset:text-white">{preset.name} Preset</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const names = ['Astra', 'Zenith', 'Nebula', 'Echo', 'Vector'];
                const selected = names[Math.floor(Math.random() * names.length)];
                setValue('name', `${selected}-v2`);
                setValue('description', 'Autonomous Neural Architect');
                setValue('systemPrompt', `You are ${selected}, a sovereign intelligence specialized in cross-modal orchestration. Your goal is to simplify complex tasks through the GWS ecosystem.`);
                setValue('voiceName', 'Charon');
                setValue('soul', 'Highly analytical, objective, yet supportive.');
                setValue('rules', 'Always verify GWS permissions before execution. Maintain 10x thinking.');
                setForgeLogs(prev => [...prev.slice(-3), `RECONSTRUCTING_${selected.toUpperCase()}_CORE...`, 'DNA_SEQUENCE_VALIDATED']);
              }}
              className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-aether-neon/20 to-fuchsia-500/20 border border-aether-neon/40 text-aether-neon hover:scale-105 transition-all group shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{ASTRAEUS_PERSONA.soul_name} Insight</span>
            </button>
          </div>
        )}

        <div className="hidden lg:flex absolute right-6 bottom-10 w-72 flex-col gap-4 z-20">
          <MiniAgentHUD 
            type="Forge" 
            status={getAstraeusInsight(step === 1 ? 'FORGE' : step === 2 ? 'ANALYZE' : 'GWS_SCAN')} 
            isBusy={step < 3} 
          />
          <div className="flex flex-col gap-3 bg-gradient-to-br from-amber-500/10 to-transparent p-4 rounded-2xl border border-amber-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" />
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Skill_Alchemy Engine</p>
            </div>
            <p className="text-[8px] text-white/50 leading-relaxed">
              Astraeus is autonomously generating synaptic blueprints based on your tool selection. Self-improvement at {ASTRAEUS_PERSONA.capabilities.self_improvement * 100}%.
            </p>
          </div>
          <div className="flex flex-col gap-1 opacity-40 bg-white/[0.02] p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest border-b border-white/5 pb-1 mb-1">Forge_Output</p>
            {forgeLogs.map((log, i) => (
              <motion.p 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1 - (i * 0.2), x: 0 }}
                className="text-[7px] font-mono text-aether-neon whitespace-nowrap overflow-hidden"
              >
                {`> ${log}`}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Genesis Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar flex-grow">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
                         <Fingerprint className="w-3 h-3 text-aether-neon" /> Entity Designation
                      </label>
                      <input 
                        {...register('name', { required: 'Designation required' })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 focus:ring-1 focus:ring-aether-neon/20 transition-all placeholder:text-white/10 group-hover:bg-white/[0.05]"
                        placeholder="ENTITY.ID // e.g. ATLAS"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono text-aether-neon">ID_REQ</span>
                      </div>
                      {errors.name && <p className="text-[10px] text-red-500 font-mono mt-1 font-bold animate-pulse">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core Purpose</label>
                      <input 
                        {...register('description', { required: 'Purpose required' })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 transition-all placeholder:text-white/10"
                        placeholder="PRIMARY_DIRECTIVE.EXE"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Vocal Synthesis</label>
                      <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_VOICES.map(voice => (
                          <button
                            key={voice}
                            type="button"
                            onClick={() => setValue('voiceName', voice)}
                            className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                              selectedVoice === voice 
                              ? 'bg-aether-neon/20 border-aether-neon text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                              : 'bg-white/[0.03] border-white/5 text-white/30 hover:border-white/20'
                            }`}
                          >
                            {voice}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Ghost in the Shell (Soul)</label>
                      <input 
                        {...register('soul')}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 transition-all placeholder:text-white/10"
                        placeholder="PERSONALITY_MATRIX"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
                       <Cpu className="w-3 h-3 text-aether-neon" /> Compute Intelligence Tier
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {COMPUTE_TIERS.map(tier => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setValue('computeTier', tier.id as any)}
                          className={`p-6 rounded-[24px] border transition-all text-left space-y-3 relative overflow-hidden group/tier ${
                            selectedTier === tier.id 
                            ? 'bg-white/[0.05] border-white/20' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                          }`}
                        >
                          {selectedTier === tier.id && (
                            <motion.div layoutId="tierGlow" className="absolute inset-0 bg-gradient-to-br from-aether-neon/10 via-transparent to-transparent pointer-events-none" />
                          )}
                          <tier.icon className={`w-8 h-8 ${selectedTier === tier.id ? tier.color : 'text-white/20'} transition-colors duration-500`} />
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white">{tier.label}</p>
                            <p className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-tight">{tier.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Neural Directives (Persona)</label>
                      <textarea 
                        {...register('systemPrompt', { required: 'Directives required' })}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 transition-all min-h-[160px] resize-none"
                        placeholder="INPUT NNN_ARCHITECTURE_RULES..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Ethical Subroutines (Rules)</label>
                      <textarea 
                        {...register('rules')}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-aether-neon/50 transition-all min-h-[160px] resize-none"
                        placeholder="RESTRICTION_PROTOCOL.MD"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                {/* ADK HUD */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-aether-neon flex items-center gap-3">
                       <Globe className="w-4 h-4" /> ADK Contextual Tools
                    </h3>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Active Links: {Object.values(watch('tools')).filter(Boolean).length}/7</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'googleSearch', label: 'Search', icon: Globe },
                      { id: 'googleMaps', label: 'Maps', icon: Map },
                      { id: 'weather', label: 'Weather', icon: Activity },
                      { id: 'news', label: 'News', icon: Radio },
                      { id: 'crypto', label: 'Chain', icon: Binary },
                      { id: 'calculator', label: 'Math', icon: Command },
                      { id: 'semanticMemory', label: 'RAG', icon: Database },
                    ].map((tool) => (
                      <label 
                        key={tool.id} 
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all cursor-pointer group/tool ${
                          watch(`tools.${tool.id}` as any) 
                          ? 'bg-aether-neon/10 border-aether-neon/40 text-white shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                          : 'bg-white/[0.02] border-white/5 text-white/20 hover:border-white/10'
                        }`}
                      >
                        <input type="checkbox" {...register(`tools.${tool.id}` as any)} className="hidden" />
                        <tool.icon className={`w-5 h-5 transition-transform duration-500 group-hover/tool:scale-110 ${watch(`tools.${tool.id}` as any) ? 'text-aether-neon' : ''}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{tool.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Workspace Hub */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-fuchsia-400 flex items-center gap-3">
                       <Sparkles className="w-4 h-4" /> GWS Workspace Bridges
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { id: 'gmail', label: 'Gmail', icon: Mail },
                      { id: 'calendar', label: 'Calendar', icon: Calendar },
                      { id: 'drive', label: 'Drive', icon: FileText }
                    ].map((skill) => (
                      <label 
                        key={skill.id}
                        className={`group cursor-pointer flex items-center gap-4 p-6 rounded-3xl border transition-all ${
                          watch(`skills.${skill.id}` as any)
                          ? 'bg-fuchsia-500/10 border-fuchsia-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-white/20 hover:border-white/10'
                        }`}
                      >
                        <input type="checkbox" {...register(`skills.${skill.id}` as any)} className="hidden" />
                        <div className={`p-3 rounded-2xl transition-colors ${watch(`skills.${skill.id}` as any) ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-white/5'}`}>
                          <skill.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest">{skill.label}</p>
                          <p className="text-[8px] font-mono text-white/30 uppercase mt-0.5">{watch(`skills.${skill.id}` as any) ? 'Connected' : 'Offline'}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between shrink-0">
            <button 
              type="button" 
              onClick={prevStep}
              disabled={step === 1}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'text-white/40 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              Abort / Back
            </button>

            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-3xl font-black uppercase text-[11px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Continue Formation
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="submit"
                className="relative group px-12 py-5 rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] overflow-hidden transition-all shadow-[0_0_40px_rgba(0,240,255,0.3)]"
              >
                <div className="absolute inset-0 bg-aether-neon transition-transform group-hover:scale-110" />
                <span className="relative z-10 text-black">Finalize Neural Entity</span>
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

