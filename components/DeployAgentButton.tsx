'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Agent } from '@/lib/store/useAetherStore';
import { installAgentAsPWA, showIOSInstallInstructions } from '@/lib/pwa/dynamic-manifest';
import { generateAgentAvatar } from '@/lib/pwa/avatar-generator';
import { saveAgentAvatar } from '@/lib/pwa/avatar-storage';

interface DeployAgentButtonProps {
  agent: Agent;
  className?: string;
}

export function DeployAgentButton({ agent, className }: DeployAgentButtonProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsInstalling(true);
    setInstallError(null);
    
    try {
      // Generate avatar if not exists
      const avatarUrl = await generateAgentAvatar({ agent });
      
      // Save to Firebase Storage
      const storedAvatarUrl = await saveAgentAvatar(agent.id || 'unknown', avatarUrl);
      
      // Install as PWA
      const success = await installAgentAsPWA({
        agent,
        avatarUrl: storedAvatarUrl,
        userId: 'current-user',
      });
      
      if (success) {
        setInstallSuccess(true);
        
        // Show iOS instructions if needed
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          showIOSInstallInstructions(agent.name);
        }
        
        setTimeout(() => {
          setInstallSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Deploy failed:', error);
      setInstallError(error instanceof Error ? error.message : 'Installation failed');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 glass-subtle rounded-2xl border border-white/10"
      >
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-4">
          Deploy Agent
        </h3>
        
        <Button
          onClick={handleDeploy}
          disabled={isInstalling || installSuccess}
          isLoading={isInstalling}
          leftIcon={
            installSuccess ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Download className="w-4 h-4" />
            )
          }
          variant={installSuccess ? 'secondary' : 'primary'}
          size="lg"
          className="w-full mb-4"
        >
          {installSuccess ? 'Deployed Successfully!' : 'Deploy to Device'}
        </Button>

        {/* Platform Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-white/40 mb-4">
          <div className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <span>Mobile</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            <span>Desktop</span>
          </div>
        </div>

        {/* Error Message */}
        {installError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
            <p className="text-xs text-red-300">{installError}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {installSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <p className="text-xs text-green-300">
              ✓ Agent deployed! You can now access {agent.name} directly from your home screen.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default DeployAgentButton;
