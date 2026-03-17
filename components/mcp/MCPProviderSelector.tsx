'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plug, 
  PlugZap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Settings,
  Key,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';
import { mcpClient } from '@/lib/mcp';
import type { MCPProvider } from '@/lib/mcp';

interface MCPProviderSelectorProps {
  onProviderConnect?: (providerId: string) => void;
  onProviderDisconnect?: (providerId: string) => void;
}

interface ProviderCardProps {
  provider: MCPProvider;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onConfigure: () => void;
}

/**
 * MCP Provider Card Component
 */
const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isConnected,
  onConnect,
  onDisconnect,
  onConfigure
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        transition-all duration-300 cursor-pointer
        ${isConnected 
          ? 'border-green-500/50 bg-green-500/10' 
          : 'border-gray-700/50 bg-gray-800/40 hover:border-cyan-500/50'
        }
        ${isHovered ? 'scale-[1.02] shadow-lg shadow-cyan-500/20' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        {isConnected ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`
            p-3 rounded-lg
            ${isConnected ? 'bg-green-500/20' : 'bg-gray-700/50'}
          `}>
            {isConnected ? (
              <PlugZap className="w-6 h-6 text-green-400" />
            ) : (
              <Plug className="w-6 h-6 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {provider.description}
            </p>
          </div>
        </div>

        {/* Auth Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-cyan-400 capitalize">
            {provider.authType === 'oauth2' ? 'OAuth 2.0' : 
             provider.authType === 'api_key' ? 'API Key' : 'No Auth'}
          </span>
          {provider.scopes && provider.scopes.length > 0 && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400">
                {provider.scopes.length} scope{provider.scopes.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <button
                onClick={onDisconnect}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-400 
                         bg-red-500/10 border border-red-500/50 rounded-lg
                         hover:bg-red-500/20 transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={onConfigure}
                className="px-4 py-2 text-sm font-medium text-cyan-400 
                         bg-cyan-500/10 border border-cyan-500/50 rounded-lg
                         hover:bg-cyan-500/20 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              disabled={!provider.enabled}
              className="flex-1 px-4 py-2 text-sm font-medium text-white 
                       bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg
                       hover:from-cyan-400 hover:to-blue-400 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Connect
            </button>
          )}
        </div>

        {/* Documentation Link */}
        {provider.documentationUrl && (
          <a
            href={provider.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs text-gray-500 
                     hover:text-cyan-400 transition-colors"
          >
            <span>Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

/**
 * MCP Provider Selector Main Component
 */
export default function MCPProviderSelector({
  onProviderConnect,
  onProviderDisconnect
}: MCPProviderSelectorProps) {
  const [providers, setProviders] = useState<MCPProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Load providers on mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const allProviders = mcpClient.getAllProviders();
      setProviders(allProviders);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (providerId: string) => {
    try {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      // Enable provider
      mcpClient.setProviderEnabled(providerId, true);
      
      // Trigger OAuth flow if needed
      if (provider.authType === 'oauth2') {
        // This would redirect to OAuth URL
        // console.log('Initiating OAuth flow for', provider.name);
      }

      setProviders(prev => prev.map(p => 
        p.id === providerId ? { ...p, enabled: true } : p
      ));

      onProviderConnect?.(providerId);
    } catch (error) {
      console.error('Failed to connect provider:', error);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      mcpClient.setProviderEnabled(providerId, false);
      
      setProviders(prev => prev.map(p => 
        p.id === providerId ? { ...p, enabled: false } : p
      ));

      onProviderDisconnect?.(providerId);
    } catch (error) {
      console.error('Failed to disconnect provider:', error);
    }
  };

  const handleConfigure = (providerId: string) => {
    setSelectedProvider(providerId);
    setShowConfigModal(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          MCP Providers
        </h2>
        <p className="text-gray-400">
          Connect external service providers to extend your agent capabilities
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading providers...</span>
        </div>
      )}

      {/* Providers Grid */}
      {!loading && providers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {providers.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isConnected={provider.enabled}
                onConnect={() => handleConnect(provider.id)}
                onDisconnect={() => handleDisconnect(provider.id)}
                onConfigure={() => handleConfigure(provider.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && providers.length === 0 && (
        <div className="text-center py-20">
          <Plug className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Providers Available
          </h3>
          <p className="text-gray-400">
            MCP providers will appear here when installed
          </p>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedProvider && (
        <MCPConfigModal
          providerId={selectedProvider}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedProvider(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * MCP Configuration Modal
 */
interface MCPConfigModalProps {
  providerId: string;
  onClose: () => void;
}

const MCPConfigModal: React.FC<MCPConfigModalProps> = ({ providerId, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Store API key using credential manager
      // This would integrate with apiCredentialsManager
      // console.log('Saving API key for provider:', providerId);
      onClose();
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Configure Provider
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 
                       rounded-lg text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white 
                       bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg
                       hover:from-cyan-400 hover:to-blue-400 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 
                       bg-gray-800 border border-gray-700 rounded-lg
                       hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
