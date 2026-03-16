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
        <h2 className="text-2xl font-bold text-white mb-2">
          API Marketplace
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
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 
                     rounded-lg text-white placeholder-gray-500
                     focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 
                   rounded-lg text-white focus:outline-none focus:border-cyan-500"
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
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{apis.length}</div>
          <div className="text-sm text-gray-400">Total APIs</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">
              {apis.filter(api => (api.popularity?.rating || 0) >= 4.5).length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Top Rated</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            <div className="text-2xl font-bold text-green-400">{categories.length - 1}</div>
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
      className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 
                 backdrop-blur-sm hover:border-cyan-500/50 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
            <Activity className="w-6 h-6 text-blue-400" />
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
        className="w-full px-4 py-2 text-sm font-medium text-white 
                 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg
                 hover:from-blue-400 hover:to-purple-400 
                 disabled:opacity-50 flex items-center justify-center gap-2"
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
