'use client';

import { useAuth } from '@/components/Providers';
import { useAetherStore } from '@/lib/store/useAetherStore';
import { VoiceAgent } from '@/components/VoiceAgent';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WorkspacePage() {
  const { user, googleAccessToken } = useAuth();
  const { agents, activeAgentId } = useAetherStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  return (
    <div className="h-full w-full p-4 lg:p-8">
      <VoiceAgent activeAgent={activeAgent} googleAccessToken={googleAccessToken} />
    </div>
  );
}
