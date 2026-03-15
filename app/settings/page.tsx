'use client';

import { Shield, Database, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/Providers';

export default function SettingsPage() {
  const { login } = useAuth();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold tracking-tight mb-2">Settings</h2>
      <p className="text-slate-400 mb-12">Configure your workspace and permissions.</p>

      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Permissions</h3>
              <p className="text-sm text-slate-400">Manage what your agents can access.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p className="font-medium">Microphone Access</p>
                <p className="text-xs text-slate-400">Required for voice interaction</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-cyan-500 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Workspace Integrations</h3>
              <p className="text-sm text-slate-400">Connect external services.</p>
            </div>
          </div>
          <div className="space-y-4">
            <button 
              onClick={login}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold">G</span>
                </div>
                <span className="font-medium">Connect Google Workspace</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
