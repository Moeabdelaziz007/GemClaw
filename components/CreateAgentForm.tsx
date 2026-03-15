'use client';

import { useForm } from 'react-hook-form';
import { X, ChevronDown, Globe, Map, Mail, Calendar, FileText, Code, Database } from 'lucide-react';

type AgentFormData = {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
  memory: string;
  skills_desc: string;
  soul: string;
  rules: string;
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

interface CreateAgentFormProps {
  onClose: () => void;
  onSubmit: (data: AgentFormData) => void;
}

export default function CreateAgentForm({ onClose, onSubmit }: CreateAgentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AgentFormData>({
    defaultValues: {
      voiceName: 'Zephyr',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0A111C] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 shrink-0">
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">Agent Genesis</h2>
          <button 
            onClick={onClose}
            type="button"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Agent Name</label>
                <input 
                  {...register('name', { required: 'Name is required' })}
                  className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="e.g. Atlas"
                />
                {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Role / Identity</label>
                <input 
                  {...register('description', { required: 'Description is required' })}
                  className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="e.g. Cybernetic Strategist"
                />
                {errors.description && <span className="text-xs text-red-400">{errors.description.message}</span>}
              </div>

              {/* Voice Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Voice Synthesis</label>
                <div className="relative">
                  <select 
                    {...register('voiceName', { required: 'Voice is required' })}
                    className="w-full bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
                  >
                    {AVAILABLE_VOICES.map(voice => (
                      <option key={voice} value={voice}>{voice}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {errors.voiceName && <span className="text-xs text-red-400">{errors.voiceName.message}</span>}
              </div>

              {/* Soul Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Agent Soul (Personality)</label>
                <input 
                  {...register('soul')}
                  className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="e.g. Empathetic and witty"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* System Prompt Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Neural Directives (Persona)</label>
                <textarea 
                  {...register('systemPrompt', { required: 'System prompt is required' })}
                  className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none min-h-[100px]"
                  placeholder="Define how the agent thinks and speaks..."
                />
                {errors.systemPrompt && <span className="text-xs text-red-400">{errors.systemPrompt.message}</span>}
              </div>

              {/* Rules Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Operational Rules</label>
                <textarea 
                  {...register('rules')}
                  className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none min-h-[100px]"
                  placeholder="Specific rules for the agent to follow..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Memory Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Initial Memory</label>
              <textarea 
                {...register('memory')}
                className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none min-h-[80px]"
                placeholder="Initial context or history..."
              />
            </div>

            {/* Skills Description Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Skills Description</label>
              <textarea 
                {...register('skills_desc')}
                className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none min-h-[80px]"
                placeholder="Describe the agent's specific capabilities..."
              />
            </div>
          </div>

          {/* ADK Tools Section */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold tracking-widest text-cyan-400 uppercase mb-4 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Neural Tools (ADK)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.googleSearch') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.googleSearch')} className="hidden" />
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.googleMaps') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.googleMaps')} className="hidden" />
                <Map className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Maps</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.weather') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.weather')} className="hidden" />
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Weather</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.news') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.news')} className="hidden" />
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">News</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.crypto') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.crypto')} className="hidden" />
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Crypto</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.calculator') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.calculator')} className="hidden" />
                <Code className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Math</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${watch('tools.semanticMemory') ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('tools.semanticMemory')} className="hidden" />
                <Database className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">RAG Memory</span>
              </label>
            </div>
          </div>

          {/* GWS Skills Section */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase mb-4 flex items-center gap-2">
              <Code className="w-3 h-3" /> Workspace Skills (GWS)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <label className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${watch('skills.gmail') ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('skills.gmail')} className="hidden" />
                <Mail className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Gmail</span>
              </label>
              <label className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${watch('skills.calendar') ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('skills.calendar')} className="hidden" />
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Calendar</span>
              </label>
              <label className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${watch('skills.drive') ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'bg-[#050B14] border-white/10 text-slate-400 hover:border-white/20'}`}>
                <input type="checkbox" {...register('skills.drive')} className="hidden" />
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Drive</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-2 shrink-0">
            <button 
              type="submit"
              className="w-full relative group px-6 py-4 rounded-2xl font-semibold tracking-widest uppercase transition-all duration-300 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 group-hover:border-cyan-300 transition-colors" />
              Initialize Neural Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

