'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, Zap, Search, Download, ExternalLink, Star, ShieldCheck, Terminal } from 'lucide-react';

import { MarketplaceCardSkeleton } from './ui/Skeleton';
import { apiMarketplaceClient } from '../lib/api-marketplace/marketplace-client';
import { mcpMarketplaceConnector } from '../lib/mcp/marketplace-connector';

const MARKETPLACE_CATEGORIES = [
  { id: 'mcp', label: 'MCP_Servers', icon: Package, color: 'gemigram-neon', desc: 'Protocol-level integrations for local & cloud services' },
  { id: 'api', label: 'Universal_APIs', icon: Globe, color: 'blue-400', desc: '20,000+ External neural endpoints' },
  { id: 'skills', label: 'Neural_Skills', icon: Zap, color: 'fuchsia-500', desc: 'Pre-trained autonomous task blocks' },
  { id: 'tools', label: 'System_Tools', icon: Terminal, color: 'orange-500', desc: 'Native OS utilities for debugging & terminal access' },
];

const MARKET_DATA: Record<string, any[]> = {
  mcp: [
    { name: 'GitHub_Orchestrator', desc: 'Full repo management & PR automation', version: 'v1.4.2', stars: 128, provider: 'GitHub' },
    { name: 'GCP_Cloud_Runner', desc: 'Direct execution on Google Cloud Platform', version: 'v0.9.1', stars: 85, provider: 'Google' },
    { name: 'Slack_Nexus', desc: 'Real-time team synchronization hubs', version: 'v2.0.0', stars: 210, provider: 'Slack' },
    { name: 'SQL_Insight', desc: 'Direct database querying & schema mapping', version: 'v1.1.0', stars: 45, provider: 'PostgreSQL' },
    { name: 'Linear_Sync', desc: 'Issue tracking & project management link', version: 'v0.5.0', stars: 62, provider: 'Linear' },
  ],
  api: [
    { name: 'Weather_Oracle', desc: 'Real-time global weather data & forecasting', version: 'v3.1', stars: 340, provider: 'OpenWeather' },
    { name: 'Binance_Spine', desc: 'Live crypto markets & orderbook streaming', version: 'v2.0', stars: 512, provider: 'Binance' },
    { name: 'Serper_Node', desc: 'Google Search API for real-time browsing', version: 'v1.0', stars: 89, provider: 'Serper.dev' },
    { name: 'Maps_Vertex', desc: 'Geospatial mapping & routing protocols', version: 'v4.2', stars: 156, provider: 'Google' },
  ],
  skills: [
    { name: 'Web_Surge', desc: 'Autonomous browsing & data extraction', version: 'v2.1', stars: 420, provider: 'Gemigram_Core' },
    { name: 'Flux_Vision', desc: 'Image generation & visual materialization', version: 'v1.2', stars: 601, provider: 'Stability' },
    { name: 'Python_Ghost', desc: 'Isolated code execution & data analysis', version: 'v3.8', stars: 312, provider: 'Gemigram' },
    { name: 'Vault_Lock', desc: 'Encrypted file management & storage', version: 'v1.0', stars: 124, provider: 'Gemigram' },
  ],
  tools: [
    { name: 'Sovereign_Term', desc: 'Full SSH & local terminal orchestration', version: 'v4.0', stars: 950, provider: 'Gemi_AIOS' },
    { name: 'Neural_Profiler', desc: 'Token usage & latency monitoring', version: 'v1.1', stars: 88, provider: 'Gemigram' },
    { name: 'Pulse_Debugger', desc: 'Real-time agent state visualization', version: 'v2.4', stars: 215, provider: 'Gemigram' },
  ]
};

export function MarketplaceHub() {
  const [activeTab, setActiveTab] = useState('mcp');
  const [isLoading, setIsLoading] = React.useState(true);
  const [marketData, setMarketData] = useState<Record<string, any[]>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'mcp') {
          const servers = await mcpMarketplaceConnector.fetchFromOfficialRegistry();
          setMarketData(prev => ({ ...prev, mcp: servers }));
        } else if (activeTab === 'api') {
          const apis = await apiMarketplaceClient.fetchFromRapidAPI();
          setMarketData(prev => ({ ...prev, api: apis }));
        }
      } catch (err) {
        console.error('Marketplace fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
        <div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase mb-4">Gemi_Market</h2>
          <p className="text-white/30 font-mono text-xs uppercase tracking-[0.3em]">{MARKETPLACE_CATEGORIES.find(c => c.id === activeTab)?.desc}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all border ${
                activeTab === cat.id 
                ? `bg-gemigram-neon/10 text-gemigram-neon border-gemigram-neon/30 shadow-[0_0_30px_rgba(16,255,135,0.1)]` 
                : 'bg-white/5 text-white/30 border-white/10 hover:border-white/20'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          <>
            {[...Array(8)].map((_, i) => (
              <MarketplaceCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {marketData[activeTab]?.map((item, i) => (
              <MarketplaceCard key={i} item={item} type={activeTab} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function MarketplaceCard({ item, type }: { item: any, type: string }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="sovereign-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group h-[340px]"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-all ${
            type === 'mcp' ? 'bg-gemigram-neon/5 border-gemigram-neon/20 text-gemigram-neon shadow-[0_0_20px_rgba(16,255,135,0.1)]' :
            type === 'api' ? 'bg-blue-400/5 border-blue-400/20 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.1)]' :
            type === 'skills' ? 'bg-fuchsia-500/5 border-fuchsia-500/20 text-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.1)]' :
            'bg-orange-500/5 border-orange-500/20 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
          }`}>
            {type === 'mcp' && <Package className="w-6 h-6" />}
            {type === 'api' && <Globe className="w-6 h-6" />}
            {type === 'skills' && <Zap className="w-6 h-6" />}
            {type === 'tools' && <Terminal className="w-6 h-6" />}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] font-bold text-white/60">{item.stars}</span>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{item.provider}</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-white uppercase mb-3 tracking-tighter truncate group-hover:text-gemigram-neon transition-colors">{item.name}</h3>
        <p className="text-sm text-white/30 leading-relaxed mb-6 line-clamp-2 font-medium">{item.desc}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
           <span>{item.version}</span>
           <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Verified</span>
        </div>
        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:bg-gemigram-neon group-hover:text-black group-hover:border-gemigram-neon transition-all flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> {type === 'api' ? 'Link_Nexus' : type === 'skills' ? 'Acquire_Skill' : 'Install_Protocol'}
        </button>
      </div>
    </motion.div>
  );
}
