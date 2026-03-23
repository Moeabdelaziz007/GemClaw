'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Agent } from '@/lib/store/useGemclawStore';
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Validate agent before deployment
  const validateAgent = (): boolean => {
    const errors: string[] = [];
    
    if (!agent.name || agent.name.trim().length === 0) {
      errors.push('Agent name is required');
    }
    
    if (!agent.voiceName) {
      errors.push('Voice configuration is missing');
    }
    
    if (!agent.soul) {
      errors.push('Soul/personality matrix is not configured');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleDeploy = async () => {
    // Pre-deployment validation
    if (!validateAgent()) {
      setInstallError('Please complete all agent configuration fields');
      return;
    }
    
    setIsInstalling(true);
    setInstallError(null);
    setIsGeneratingAvatar(true);
    
    try {
      // Step 1: Generate and validate avatar
      // console.log('[DeployAgent] Generating avatar...');
      const avatarUrl = await generateAgentAvatar({ agent });
      
      if (!avatarUrl || !avatarUrl.startsWith('data:image/')) {
        throw new Error('Failed to generate valid avatar image');
      }
      
      setIsGeneratingAvatar(false);
      // console.log('[DeployAgent] Avatar generated successfully');
      
      // Step 2: Save to Firebase Storage with retry logic
      let storedAvatarUrl: string = '';
      let retries = 3;
      
      while (retries > 0) {
        try {
          storedAvatarUrl = await saveAgentAvatar(agent.id || 'unknown', avatarUrl);
          break;
        } catch (storageError) {
          retries--;
          if (retries === 0) throw storageError;
          // console.log(`[DeployAgent] Retrying avatar upload... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // console.log('[DeployAgent] Avatar saved to Firebase Storage:', storedAvatarUrl);
      
      // Step 3: Install as PWA
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
      console.error('[DeployAgent] Deployment failed:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Installation failed. Please try again.';
      setInstallError(errorMessage);
      
      // Auto-dismiss error after 10 seconds
      setTimeout(() => {
        setInstallError(null);
      }, 10000);
    } finally {
      setIsInstalling(false);
      setIsGeneratingAvatar(false);
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
          disabled={isInstalling || installSuccess || validationErrors.length > 0}
          isLoading={isInstalling || isGeneratingAvatar}
          loadingText={isGeneratingAvatar ? 'Generating Avatar...' : 'Deploying...'}
          leftIcon={
            installSuccess ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : isGeneratingAvatar ? (
              <Monitor className="w-4 h-4 animate-pulse" />
            ) : (
              <Download className="w-4 h-4" />
            )
          }
          variant={installSuccess ? 'secondary' : 'primary'}
          size="lg"
          className="w-full mb-4"
        >
          {installSuccess ? 'Deployed Successfully!' : validationErrors.length > 0 ? 'Configuration Required' : 'Deploy to Device'}
        </Button>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-4"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-xs text-yellow-300 font-semibold">Missing Configuration:</p>
                <ul className="text-xs text-yellow-200/80 list-disc list-inside space-y-0.5">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

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
