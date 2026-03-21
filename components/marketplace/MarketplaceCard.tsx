'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Download, ShieldCheck, Zap, Loader2, Check } from 'lucide-react';
import type { Agent } from '@/lib/store/slices/createAgentSlice';
import { useTranslation } from '@/hooks/useTranslation';

interface MarketplaceCardProps {
  agent: Agent;
  onInstall: (agent: Agent) => void;
  isInstalled?: boolean;
  isInstalling?: boolean;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ 
  agent, 
  onInstall, 
  isInstalled = false, 
  isInstalling = false 
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isInstalled && !isInstalling ? { scale: 1.02, boxShadow: '0 0 25px rgba(0, 255, 255, 0.2)' } : {}}
      role="article"
      aria-label={`${agent.name} - ${agent.role}`}
      className={`relative group border rounded-2xl p-6 overflow-hidden backdrop-blur-md transition-all duration-300 ${
        isInstalled 
        ? 'bg-zinc-900/30 border-white/5 opacity-80' 
        : 'glass-medium border-white/10 hover:border-gemigram-neon/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]'
      }`}
    >
      {/* Background Accent */}
      <div 
        aria-hidden="true"
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl transition-colors duration-500 ${
          isInstalled ? 'bg-zinc-800/10' : 'bg-gemigram-neon/5 group-hover:bg-gemigram-neon/20'
        }`} 
      />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 overflow-hidden ${
          isInstalled ? 'bg-zinc-800 grayscale' : 'bg-gradient-to-br from-gemigram-neon/80 to-green-600/80 group-hover:scale-110 border border-gemigram-neon/50'
        }`}>
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt={`${agent.name} ${t('marketplace.avatar')}`} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <Zap aria-hidden="true" className="w-7 h-7" />
          )}
        </div>
        <div 
          className="flex items-center gap-1 bg-black/80 px-2 py-1 rounded-md text-xs font-medium text-gemigram-neon border border-gemigram-neon/30"
          aria-label={`${t('marketplace.rating')}: ${agent.rating || '4.9'} ${t('marketplace.stars')}`}
        >
          <Star aria-hidden="true" className="w-3 h-3 fill-gemigram-neon" />
          {agent.rating || '4.9'}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className={`text-xl font-bold mb-1 transition-colors ${
          isInstalled ? 'text-zinc-500' : 'text-white group-hover:text-gemigram-neon'
        }`}>
          {agent.name}
        </h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {agent.role} • {t('marketplace.by')} {agent.creatorNickname || t('marketplace.sovereign_architect')}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2 py-1 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider rounded border border-white/10">
            {agent.category || t('marketplace.general')}
          </span>
          {agent.tools?.googleSearch && (
            <span className="px-2 py-1 bg-gemigram-neon/10 text-gemigram-neon text-[10px] uppercase tracking-wider rounded border border-gemigram-neon/30">
              {t('marketplace.web_search')}
            </span>
          )}
        </div>

        <button
          disabled={isInstalled || isInstalling}
          onClick={() => onInstall(agent)}
          aria-label={isInstalling ? t('marketplace.installing') : isInstalled ? t('marketplace.owned') : `${t('marketplace.install')} ${agent.name}`}
          className={`w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 group/btn ${
            isInstalled 
            ? 'bg-white/5 text-white/30 cursor-default border border-white/10' 
            : 'bg-white text-black hover:bg-gemigram-neon hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]'
          }`}
        >
          {isInstalling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              {t('marketplace.manifesting')}
            </>
          ) : isInstalled ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              {t('marketplace.owned')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4 group-hover/btn:animate-bounce" aria-hidden="true" />
              {t('marketplace.initialize')}
            </>
          )}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-1">
          <ShieldCheck aria-hidden="true" className={`w-3 h-3 ${isInstalled ? 'text-zinc-600' : 'text-gemigram-neon'}`} />
          {t('marketplace.neural_verified')}
        </div>
        <div aria-label={`${t('marketplace.version')} 1.0.4`}>V1.0.4</div>
      </div>
    </motion.div>
  );
};
