'use client';

import { useAuth } from '@/components/Providers';
import { useAetherStore } from '@/lib/store/useAetherStore';
import SovereignDashboard from '@/components/SovereignDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { agents, setActiveAgentId } = useAetherStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <SovereignDashboard 
      user={user} 
      agents={agents}
      onStartForge={() => router.push('/forge')}
      onSelectAgent={(id) => {
        setActiveAgentId(id);
        router.push('/workspace');
      }}
    />
  );
}
