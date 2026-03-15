'use client';

import { useAuth } from '@/components/Providers';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sparkles, Fingerprint, Activity } from 'lucide-react';
import HeroBackground from '@/components/HeroBackground';
import NeuralPulse from '@/components/NeuralPulse';
import { DigitalEntity } from '@/components/DigitalEntity';

export default function LandingPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-aether-black">
      <HeroBackground />
      
      {/* Hero Section - HUD REDESIGN */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 z-10">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Control */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-aether-neon to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-4 py-2 bg-black rounded-full border border-white/10 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-aether-neon animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
                  Gemigram Neural Link · V2.0
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              <span className="text-white block">Sovereign</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-aether-neon via-white to-purple-400">Intelligence.</span>
              <span className="text-white/40 block text-2xl md:text-3xl font-light tracking-widest mt-4">ZERO FRICTION AIOS</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 font-medium max-w-xl mb-12 leading-relaxed border-l-2 border-aether-neon/30 pl-6">
              Deploy autonomous neural agents in your workspace. Build with Google Gemini, scale with the Sovereign Local Spine. Your data, your rules.
            </p>

            <div className="flex flex-wrap gap-6 mb-16">
              <motion.button 
                onClick={login}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-aether-neon transition-all duration-500 shadow-[0_0_30px_rgba(0,242,255,0.2)] flex items-center gap-4 group"
              >
                <Fingerprint className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>Initialize Identity</span>
              </motion.button>
              
              <motion.button 
                onClick={() => router.push('/hub')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-aether-neon/50 text-white font-bold text-lg transition-all duration-500 flex items-center gap-4 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                <span>Browse Neural Assets</span>
                <Activity className="w-5 h-5 text-aether-neon/60" />
              </motion.button>
            </div>

            {/* Infrastructure Radar */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 w-full max-w-lg opacity-40 hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Neural</span>
                <span className="text-xs font-bold text-white/80">Gemini 1.5 Pro</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Spine</span>
                <span className="text-xs font-bold text-white/80">Local-First</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Encryption</span>
                <span className="text-xs font-bold text-white/80">AES-256 GCM</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Standby Entity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[500px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] animate-pulse" />
            <div className="relative z-10 w-full transform scale-75 md:scale-90 lg:scale-100">
              <DigitalEntity state="Disconnected" volume={0} agentName="GEMIGRAM" />
            </div>
            
            {/* UI Frames */}
            <div className="absolute inset-0 pointer-events-none border border-white/[0.03] rounded-[4rem]" />
            <div className="absolute inset-4 pointer-events-none border border-white/[0.03] rounded-[3.5rem]" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 lg:px-20 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">Why Choose Gemigram</h2>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">Everything you need to build, deploy, and manage autonomous AI agents</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: "Voice-Native Agents",
                description: "Build AI agents that communicate naturally through voice and text in real-time."
              },
              {
                icon: Activity,
                title: "Real-Time Autonomy",
                description: "Deploy agents that operate independently and adapt to changing conditions instantly."
              },
              {
                icon: Fingerprint,
                title: "Sovereign Control",
                description: "Complete ownership and control over your AI entities and data with zero intermediaries."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
                title: "Unified Dashboard",
                description: "Manage all your agents from a single, intuitive platform with real-time monitoring."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                title: "Memory & Context",
                description: "Agents retain conversation history and learn from interactions over time."
              },
              {
                icon: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                title: "Flexible Customization",
                description: "Fine-tune agent behavior, capabilities, and personalities to match your needs."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group p-6 md:p-8 rounded-2xl quantum-glass border border-white/5 hover:border-aether-neon/20 hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-aether-neon/10 flex items-center justify-center mb-4 group-hover:bg-aether-neon/20 transition-colors">
                    <Icon className="w-6 h-6 text-aether-neon" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 px-4 md:px-8 lg:px-20 z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-aether-neon/10 to-transparent border border-aether-neon/20 p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6">Ready to Build?</h2>
            <p className="text-base md:text-lg text-white/70 mb-8 max-w-2xl mx-auto">Start creating autonomous AI agents today. No credit card required.</p>
            <motion.button
              onClick={login}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl bg-aether-neon text-black font-black text-base md:text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-aether-neon/50"
            >
              Launch Platform
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
