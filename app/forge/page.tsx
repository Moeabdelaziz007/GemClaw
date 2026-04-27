'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useGemclawStore, Agent } from '@/lib/store/useGemclawStore';
import ConversationalAgentCreator from '@/components/ConversationalAgentCreator';
import ForgeChamber from '@/components/ForgeChamber';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { createMemory } from '@/lib/memory/memory-store';
import { startAgentHeartbeat } from '@/lib/agents/heartbeat';

export default function ForgePage() {
  const { user, loading } = useAuth();
  const { setActiveAgentId, pendingManifest, setPendingManifest, voiceSession, setVoiceSession } = useGemclawStore();
  const [isForging, setIsForging] = useState(false);
  const [pendingAgentData, setPendingAgentData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    setVoiceSession({
      stage: 'forge',
      lastVoiceAction: isForging ? 'Finalizing your agent blueprint...' : 'Forge is ready. Start voice onboarding when you are ready.',
    });
  }, [isForging, setVoiceSession]);

  useEffect(() => {
    if (voiceSession.stage === 'workspace') {
      router.push('/workspace');
    }
  }, [voiceSession.stage, router]);

  useEffect(() => {
    if (pendingManifest && !isForging) {
      setPendingAgentData(pendingManifest);
      setIsForging(true);
    }
  }, [pendingManifest, isForging]);

  const handleCreateAgent = (data: any) => {
    setPendingAgentData(data);
    setIsForging(true);
  };

  const handleForgeComplete = async () => {
    if (!pendingAgentData || !user) {
      router.push('/dashboard');
      return;
    }

    const data = pendingAgentData;
    const agentId = data.name.toLowerCase().replace(/\s+/g, '-');
    const aetherId = `ath://${agentId}-${nanoid(6)}`;
    const newAgent: Agent = {
      id: agentId,
      aetherId,
      name: data.name,
      role: data.role || data.description,
      users: '0',
      seed: data.name.toLowerCase(),
      systemPrompt: data.systemPrompt,
      voiceName: data.voiceName,
      ownerId: user.uid,
      memory: data.memory || 'Initializing sovereign memory...',
      skills_desc: data.skills_desc || 'Sovereign Skillset',
      soul: data.soul,
      rules: data.rules,
      tools: data.tools,
      skills: data.skills,
    };

    try {
      // Use Sovereign Store to sync outbound
      const { useSovereignStore } = await import('@/lib/store/useSovereignStore');
      await useSovereignStore.getState().saveAgent(user.uid, newAgent);

      await createMemory({
        agentId,
        userId: user.uid,
        type: 'semantic',
        content: `Agent ${data.name} created with purpose: ${data.description}`,
        importance: 1.0,
        decay: data.memoryDecay || 0.01,
        accessCount: 0,
        tags: ['creation', 'origin', 'core_directive', 'identity'],
        metadata: {
          source: 'agent_learning',
          context: 'Initial memory imprint during forging',
          soulType: data.soul,
          personaType: data.persona || 'default',
        },
      });

      await createMemory({
        agentId,
        userId: user.uid,
        type: 'procedural',
        content: `Primary operational directive: ${data.description}. Configured with tools and skills as specified.`,
        importance: 0.95,
        decay: 0.005,
        accessCount: 0,
        tags: ['skills', 'directives', 'operational'],
        metadata: {
          source: 'agent_learning',
          context: 'Skill and tool configuration during creation',
          configuredTools: data.tools,
          configuredSkills: data.skills,
        },
      });

      startAgentHeartbeat(agentId);

      setPendingAgentData(null);
      setPendingManifest(null);
      setIsForging(false);
      setActiveAgentId(agentId);
      setVoiceSession({
        stage: 'workspace',
        lastVoiceAction: `Agent ${data.name} is active. Continue by establishing voice link.`,
      });
      router.push('/workspace');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
      setIsForging(false);
      router.push('/dashboard');
    }
  };

  if (loading || !user) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg-primary">
      {/* Sovereign Background Layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-1/4 top-1/4 h-[60vw] w-[60vw] rounded-full bg-gemigram-neon/10 blur-[180px] mix-blend-screen opacity-50" />
        <div className="absolute -right-1/4 bottom-1/4 h-[60vw] w-[60vw] rounded-full bg-accent-purple/10 blur-[180px] mix-blend-screen opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 opacity-[0.05] carbon-fiber" />
      </div>

      <div className="relative z-10 h-full w-full overflow-y-auto pb-nav-safe transition-opacity duration-1000">
        {!isForging ? (
          <ConversationalAgentCreator onClose={() => router.push('/dashboard')} onSubmit={handleCreateAgent} />
        ) : (
          <ForgeChamber onComplete={handleForgeComplete} />
        )}
      </div>
    </div>
  );
}
