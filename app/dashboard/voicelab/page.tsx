'use client';

import { useRouter } from 'next/navigation';
import VoiceLab from '@/components/VoiceLab';
import { useAuth } from '@/components/Providers';
import { useEffect } from 'react';

export default function VoiceLabPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <VoiceLab onBack={() => router.push('/dashboard')} />
      </div>
    </div>
  );
}
