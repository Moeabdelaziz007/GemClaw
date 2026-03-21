'use client';

import { Shield, ChevronRight, Mic, Database, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { login, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [skills, setSkills] = useState([
    { id: 'google_search', name: 'Google Search', desc: 'Real-time web information', enabled: true, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    { id: 'weather', name: 'Weather Data', desc: 'Current conditions and forecasts', enabled: true, color: 'text-gemigram-neon', bg: 'bg-gemigram-neon/10', border: 'border-gemigram-neon/30' },
    { id: 'crypto', name: 'Crypto Prices', desc: 'Live cryptocurrency rates', enabled: false, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
    { id: 'maps', name: 'Google Maps', desc: 'Location and navigation data', enabled: false, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
    { id: 'calculator', name: 'Calculator', desc: 'Mathematical computations', enabled: true, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
    { id: 'semantic_memory', name: 'Semantic Memory', desc: 'Long-term context retention', enabled: true, color: 'text-gemigram-neon', bg: 'bg-gemigram-neon/10', border: 'border-gemigram-neon/30' },
  ]);

  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'Zephyr (Default)',
    rate: 1.0,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Settings
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'users', user.uid, 'settings', 'preferences'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          
          if (data.skills) {
            setSkills(prev => prev.map(s => ({
              ...s,
              enabled: data.skills[s.id] ?? s.enabled
            })));
          }

          if (data.voiceSettings) {
            setVoiceSettings(data.voiceSettings);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
        skills: skills.reduce((acc, s) => ({ ...acc, [s.id]: s.enabled }), {}),
        voiceSettings,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setHasChanges(false);
      toast.success('Settings synchronized successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to synchronize settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Database },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'skills', label: 'Skills & Tools', icon: Shield },
  ];

  const toggleSkill = (id: string) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, enabled: !skill.enabled } : skill)));
    setHasChanges(true);
  };

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h2 className="page-title bg-gradient-to-r from-neon-green via-cyan-400 to-electric-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,255,135,0.3)]">Settings</h2>
        <p className="page-copy text-white/50">Configure your sovereign intelligence and neural links.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 p-1.5 cyber-panel no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 ${
              activeTab === tab.id ? 'bg-gemigram-neon text-black shadow-[0_0_20px_rgba(16,255,135,0.3)]' : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="pb-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gemigram-neon/30 bg-gradient-to-br from-gemigram-neon/20 to-green-500/20">
                    <Database className="h-7 w-7 text-gemigram-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Sovereign Identity</h3>
                    <p className="text-sm text-white/40">Manage your seamless Google integration for all AI services.</p>
                  </div>
                </div>
                {user ? (
                  <div className="relative flex flex-col gap-4 rounded-2xl border border-gemigram-neon/30 p-5 glass-medium sm:flex-row sm:items-center sm:justify-between hover:border-gemigram-neon/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10">
                        <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} alt="Profile" className="h-10 w-10 rounded-lg" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold tracking-wide text-white">{user.displayName || 'Authorized Architect'}</p>
                        <p className="mt-0.5 text-xs font-mono text-gemigram-neon">Authorized: {user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-fit rounded-full border border-gemigram-neon bg-gemigram-neon/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gemigram-neon">Linked</div>
                      <button onClick={logout} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-white/5 py-1.5 px-3 rounded-full border border-red-500/20 hover:bg-white/10 uppercase tracking-widest">Disconnect</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={login} className="group relative flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-gemigram-neon/50 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 transition-transform group-hover:scale-110">
                        <span className="text-xl font-black text-white">G</span>
                      </div>
                      <div>
                        <p className="font-bold tracking-wide text-white">Connect Universal Identity</p>
                        <p className="mt-1 text-sm text-white/40">Sign in with Google to automatically unlock Gemini, Firebase, and Jules integrations securely without API keys.</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/20 transition-colors group-hover:text-gemigram-neon" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-gemigram-neon/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gemigram-neon/30 bg-gradient-to-br from-gemigram-neon/20 to-cyan-500/20">
                    <Mic className="h-7 w-7 text-gemigram-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Voice Configuration</h3>
                    <p className="text-sm text-white/40">Customize voice settings and audio preferences.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <select 
                        value={voiceSettings.voice}
                        aria-label="Select Voice Profile"
                        onChange={(e) => {
                          setVoiceSettings({ ...voiceSettings, voice: e.target.value });
                          setHasChanges(true);
                        }}
                        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-gemigram-neon/50 focus:outline-none w-full"
                      >
                        <option>Zephyr (Default)</option>
                        <option>Charon</option>
                        <option>Puck</option>
                        <option>Kore</option>
                        <option>Fenrir</option>
                      </select>
                    </div>
                  
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-white">Speech Rate</p>
                        <p className="mt-0.5 text-xs text-white/40">Adjust conversation speed</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-white/40">Slow</span>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2" 
                          step="0.1" 
                          value={voiceSettings.rate}
                          aria-label="Adjust Speech Rate"
                          onChange={(e) => {
                            setVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) });
                            setHasChanges(true);
                          }}
                          className="w-full max-w-40 accent-gemigram-neon" 
                        />
                        <span className="text-xs text-white/40">Fast</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-white">Voice Cloning</p>
                        <p className="mt-0.5 text-xs text-white/40">Create custom voice profiles</p>
                      </div>
                      <button className="btn-secondary w-full md:w-auto">Clone Voice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-gemigram-neon/5 to-transparent p-5 glass-strong sm:p-6 md:p-8">
                <div className="relative z-10 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gemigram-neon/30 bg-gradient-to-br from-gemigram-neon/20 to-green-500/20">
                    <Shield className="h-7 w-7 text-gemigram-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Agent Skills & Tools</h3>
                    <p className="mt-1 text-sm font-medium tracking-wide text-white/50">Enable or disable neural capabilities for your sovereign agents. API usage is securely authorized via your Google login.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {skills.map((skill) => (
                    <motion.div key={skill.id} whileHover={{ y: -5 }} className={`relative overflow-hidden rounded-2xl border p-5 glass-medium transition-all duration-300 ${skill.enabled ? 'border-gemigram-neon/40 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/10 bg-black/40'}`}>
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-base font-black uppercase tracking-tight text-white">{skill.name}</h4>
                          <p className="mt-1 text-sm text-white/45">{skill.desc}</p>
                        </div>
                        <button onClick={() => toggleSkill(skill.id)} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${skill.enabled ? 'bg-gemigram-neon text-black' : 'bg-white/10 text-white/60'}`}>
                          {skill.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {hasChanges && (
        <div className="fixed-safe-bottom safe-x fixed left-4 right-4 z-[90] sm:left-auto sm:right-6">
          <div className="ml-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-gemigram-neon/40 bg-black/90 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/70 font-medium">Unsaved configuration changes.</p>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin text-black" />
                  Saving
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <RefreshCcw className="w-10 h-10 text-gemigram-neon animate-spin" />
            <p className="text-gemigram-neon font-bold tracking-widest text-sm uppercase">Loading Neural State</p>
          </div>
        </div>
      )}
    </div>
  );
}
