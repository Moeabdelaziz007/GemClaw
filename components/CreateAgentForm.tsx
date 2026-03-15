'use client';

import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

type AgentFormData = {
  name: string;
  description: string;
  systemPrompt: string;
  voiceName: string;
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
    formState: { errors },
  } = useForm<AgentFormData>({
    defaultValues: {
      voiceName: 'Zephyr',
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0A111C] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase">Create Agent</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          
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
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Description</label>
            <input 
              {...register('description', { required: 'Description is required' })}
              className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
              placeholder="e.g. AI Companion"
            />
            {errors.description && <span className="text-xs text-red-400">{errors.description.message}</span>}
          </div>

          {/* System Prompt Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">System Prompt</label>
            <textarea 
              {...register('systemPrompt', { required: 'System prompt is required' })}
              className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none h-24"
              placeholder="You are a helpful assistant..."
            />
            {errors.systemPrompt && <span className="text-xs text-red-400">{errors.systemPrompt.message}</span>}
          </div>

          {/* Voice Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Voice Synthesis</label>
            <select 
              {...register('voiceName', { required: 'Voice is required' })}
              className="bg-[#050B14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none"
            >
              {AVAILABLE_VOICES.map(voice => (
                <option key={voice} value={voice}>{voice}</option>
              ))}
            </select>
            {errors.voiceName && <span className="text-xs text-red-400">{errors.voiceName.message}</span>}
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button 
              type="submit"
              className="w-full relative group px-6 py-3 rounded-xl font-semibold tracking-widest uppercase transition-all duration-300 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              <div className="absolute inset-0 rounded-xl border border-cyan-400/50 group-hover:border-cyan-300 transition-colors" />
              Initialize Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
