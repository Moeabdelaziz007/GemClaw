'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, Shield, AlertTriangle, CheckCircle, Trash2, RefreshCw,
  Plus, Eye, EyeOff, Copy, ExternalLink, Lock, Clock, Activity
} from 'lucide-react';
import { apiCredentialsManager } from '@/lib/security/api-credentials';

interface APICredentialsManagerProps {
  onCredentialAdd?: (credentialId: string) => void;
  onCredentialRemove?: (credentialId: string) => void;
}

export default function APICredentialsManager({ 
  onCredentialAdd, 
  onCredentialRemove 
}: APICredentialsManagerProps) {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    totalCredentials: 0,
    expiringSoon: 0,
    expired: 0,
    needsRotation: 0
  });

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    try {
      setLoading(true);
      const creds = apiCredentialsManager.listCredentials();
      const stats = apiCredentialsManager.getStatistics();
      setCredentials(creds);
      setStats(stats);
    } catch (error) {
      console.error('Failed to load credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (credentialId: string) => {
    apiCredentialsManager.deleteCredential(credentialId);
    loadCredentials();
    onCredentialRemove?.(credentialId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            API Credentials
          </h2>
          <p className="text-gray-400">
            Manage your API keys and OAuth tokens securely
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm font-medium text-white 
                   bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg
                   hover:from-cyan-400 hover:to-blue-400 
                   flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Credential
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-blue-400" />
            <div className="text-2xl font-bold text-blue-400">{stats.totalCredentials}</div>
          </div>
          <div className="text-sm text-gray-400">Total Keys</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{stats.expiringSoon}</div>
          </div>
          <div className="text-sm text-gray-400">Expiring Soon</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="text-2xl font-bold text-red-400">{stats.expired}</div>
          </div>
          <div className="text-sm text-gray-400">Expired</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">{stats.needsRotation}</div>
          </div>
          <div className="text-sm text-gray-400">Needs Rotation</div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-1">
              Security Features
            </h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• All credentials are encrypted at rest</li>
              <li>• Automatic expiration tracking</li>
              <li>• API key rotation support</li>
              <li>• Audit logging enabled</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Activity className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading credentials...</span>
        </div>
      )}

      {/* Credentials List */}
      {!loading && credentials.length > 0 && (
        <div className="space-y-3">
          {credentials.map(cred => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              onDelete={() => handleDelete(cred.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && credentials.length === 0 && (
        <div className="text-center py-20">
          <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Credentials Stored
          </h3>
          <p className="text-gray-400 mb-4">
            Add your first API key or OAuth token
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 text-sm font-medium text-white 
                     bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg
                     hover:from-cyan-400 hover:to-blue-400 
                     inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddCredentialModal
          onClose={() => setShowAddModal(false)}
          onAdd={(id) => {
            loadCredentials();
            onCredentialAdd?.(id);
          }}
        />
      )}
    </div>
  );
}

function CredentialCard({ credential, onDelete }: any) {
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(credential.maskedValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 
                 backdrop-blur-sm hover:border-cyan-500/50 transition-all"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Key className="w-5 h-5 text-cyan-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-white capitalize">
                {credential.credentialType.replace('_', ' ')}
              </h4>
              {credential.isExpired ? (
                <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 rounded-md">
                  Expired
                </span>
              ) : credential.expiresAt && 
                (credential.expiresAt - Date.now()) < 7 * 24 * 60 * 60 * 1000 ? (
                <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-400 rounded-md">
                  Expiring Soon
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-md">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">Provider: {credential.providerId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title="Copy"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => setShowValue(!showValue)}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
            title={showValue ? "Hide" : "Show"}
          >
            {showValue ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showValue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-700"
          >
            <div className="text-xs font-mono text-gray-300 break-all">
              {credential.maskedValue}
            </div>
            {credential.expiresAt && (
              <div className="mt-2 text-xs text-gray-400">
                Expires: {new Date(credential.expiresAt).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddCredentialModal({ onClose, onAdd }: any) {
  const [providerId, setProviderId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!providerId || !apiKey) return;
    
    setSaving(true);
    try {
      const credId = apiCredentialsManager.storeAPIKey(providerId, apiKey);
      onAdd(credId);
      onClose();
    } catch (error) {
      console.error('Failed to save credential:', error);
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
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Add New Credential
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Provider ID
            </label>
            <input
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              placeholder="e.g., openai, github, stripe..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 
                       rounded-lg text-white placeholder-gray-500
                       focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              API Key / Token
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

          <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-gray-300">
                Your credential will be encrypted and stored securely
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !providerId || !apiKey}
            className="flex-1 px-4 py-2 text-sm font-medium text-white 
                     bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg
                     hover:from-cyan-400 hover:to-blue-400 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Credential'}
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
      </motion.div>
    </div>
  );
}
