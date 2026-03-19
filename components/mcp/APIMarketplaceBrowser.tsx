'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Star, Download, TrendingUp, 
  Shield, Zap, Globe, Key, Activity, CheckCircle,
  AlertCircle, Loader2, ExternalLink, RefreshCw
} from 'lucide-react';
import { apiMarketplaceClient } from '@/lib/api-marketplace/marketplace-client';

interface APIMarketplaceBrowserProps {
  onAPISubscribe?: (apiId: string, plan: string) => void;
}

export default function APIMarketplaceBrowser({ onAPISubscribe }: APIMarketplaceBrowserProps) {
  const [apis, setAPIs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadAPIs();
  }, []);

  const loadAPIs = async () => {
    try {
      setLoading(true);
      await apiMarketplaceClient.fetchFromRapidAPI();
      await apiMarketplaceClient.fetchFromAPILayer();
      
      const cats = apiMarketplaceClient.getCategories();
      setCategories(['all', ...cats]);
      
      const allAPIs = apiMarketplaceClient.searchAPIs('');
      setAPIs(allAPIs);
    } catch (error) {
      console.error('Failed to load APIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAPIs = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">
          Gemi_Nexus <span className="text-gemigram-neon">Marketplace</span>
        </h2>
        <p className="text-gray-400">
          Discover and subscribe to thousands of APIs
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search APIs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 
                     rounded-lg text-white placeholder-white/20
                     focus:outline-none focus:border-gemigram-neon"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 
                   rounded-lg text-white focus:outline-none focus:border-gemigram-neon"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gemigram-neon/10 to-accent-purple/10 border border-gemigram-neon/30 rounded-lg p-4 sovereign-glass">
          <div className="text-2xl font-bold text-gemigram-neon">{apis.length}</div>
          <div className="text-sm text-gray-400">Total APIs</div>
        </div>
        <div className="bg-gradient-to-br from-accent-purple/10 to-pink-500/10 border border-accent-purple/30 rounded-lg p-4 sovereign-glass">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent-purple" />
            <div className="text-2xl font-bold text-accent-purple">
              {apis.filter(api => (api.popularity?.rating || 0) >= 4.5).length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Top Rated</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-gemigram-neon/10 border border-emerald-500/30 rounded-lg p-4 sovereign-glass">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gemigram-neon" />
            <div className="text-2xl font-bold text-gemigram-neon">{categories.length - 1}</div>
          </div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">20,000+</div>
          </div>
          <div className="text-sm text-gray-400">Available via RapidAPI</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading APIs...</span>
        </div>
      )}

      {/* API Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAPIs.map(api => (
            <APIKeyCard
              key={api.id}
              api={api}
              onSubscribe={(plan) => onAPISubscribe?.(api.id, plan)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function APIKeyCard({ api, onSubscribe }: { api: any; onSubscribe: (plan: string) => void }) {
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      await apiMarketplaceClient.subscribeToAPI(api.id, 'free', 'demo-key');
      onSubscribe('free');
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <motion.div
      className="bg-black/40 border border-white/5 rounded-xl p-6 
                 backdrop-blur-sm hover:border-gemigram-neon/50 transition-all sovereign-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-accent-purple/20 to-gemigram-neon/20 rounded-lg">
            <Activity className="w-6 h-6 text-gemigram-neon" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{api.name}</h3>
            <p className="text-sm text-gray-400">{api.provider}</p>
          </div>
        </div>
        {api.pricing.free && (
          <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-md">
            Free Tier
          </span>
        )}
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{api.description}</p>

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{api.popularity?.rating?.toFixed(1) || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="capitalize">{api.authType}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-4 h-4" />
          <span>{api.popularity?.subscribers || 0}</span>
        </div>
      </div>

      {api.rateLimits && (
        <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
          <div className="text-xs text-gray-400">Rate Limits:</div>
          <div className="text-sm text-gray-300">
            {api.rateLimits.requestsPerMonth?.toLocaleString() || 'Unlimited'} requests/month
          </div>
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={subscribing}
        className="w-full px-4 py-2 text-sm font-black uppercase tracking-widest text-white 
                 bg-gradient-to-r from-accent-purple to-gemigram-neon rounded-lg
                 hover:shadow-[0_0_20px_rgba(16,255,135,0.3)] 
                 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
      >
        {subscribing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Key className="w-4 h-4" />
            Subscribe
          </>
        )}
      </button>

      {api.documentationUrl && (
        <a
          href={api.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-xs text-gray-500 
                   hover:text-cyan-400 transition-colors"
        >
          <span>Documentation</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
}
