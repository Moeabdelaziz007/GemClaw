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
    <div className="relative min-h-[calc(100vh-80px)] flex items-center pt-20 pb-20 px-6 lg:px-20 overflow-hidden">
      <HeroBackground />
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Column: Vision & Action */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aether-neon/10 border border-aether-neon/20 text-aether-neon text-[10px] uppercase tracking-[0.2em] font-black mb-8">
            <Sparkles className="w-3 h-3" />
            <span>Protocol V2.0 // Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="text-white drop-shadow-sm">Gemigram</span>
            <span className="text-aether-neon"> AIOS</span>
            <br />
            <span className="text-white/40 text-4xl md:text-6xl lg:text-7xl font-light">The Sovereign Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 font-medium max-w-xl mb-10 leading-relaxed">
            Move beyond chat. Deploy voice-native agents that run your workspace through the 
            <span className="text-white"> Google Sovereign Ecosystem</span>. 
            Zero friction. Infinite autonomy.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-20">
            <button 
              onClick={login}
              className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-aether-neon hover:text-black transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-aether-neon/40 active:scale-95 flex items-center gap-4 group"
            >
              <Fingerprint className="w-6 h-6 animate-pulse group-hover:scale-110 transition-transform" />
              Establish Sovereign Link
            </button>
            
            <button 
              onClick={() => router.push('/hub')}
              className="px-8 py-5 rounded-xl quantum-glass border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3 group"
            >
              Explore Network <Activity className="w-5 h-5 group-hover:text-aether-neon transition-colors" />
            </button>
          </div>

          {/* Trust Bar (Google Ecosystem) */}
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 border-r border-white/10 pr-8">Built on</div>
            <div className="flex items-center gap-6">
              <Image src="https://www.gstatic.com/images/branding/product/2x/firebase_64dp.png" alt="Firebase" width={24} height={24} className="opacity-80" />
              <Image src="https://www.gstatic.com/lamda/images/favicon_v1_150160d5dd06cf22b82.svg" alt="Gemini" width={24} height={24} />
              <Image src="https://www.gstatic.com/images/branding/product/2x/workspace_64dp.png" alt="GWS" width={24} height={24} className="opacity-80" />
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Mascot & Live Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
          className="relative flex flex-col items-center lg:items-end justify-center"
        >
          {/* Central Mascot Entity (Dynamic) */}
          <div className="relative w-full aspect-square max-w-[500px] mb-12 flex items-center justify-center">
            <div className="relative z-10 w-full h-full scale-125">
               <DigitalEntity volume={0.1} state="disconnected" />
            </div>
            
            {/* Orbital Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/[0.03] rounded-full animate-orbit" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-t border-aether-neon/10 rounded-full animate-orbit" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
          </div>

          {/* Live Neural Feed (Moltbook Style) */}
          <div className="lg:absolute -bottom-10 -left-10 z-20 w-full max-w-[280px]">
            <NeuralPulse />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
