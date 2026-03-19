'use client';
export const dynamic = 'force-static';

import nextDynamic from 'next/dynamic';

const GalaxyScene = nextDynamic(() => import('@/components/galaxy/GalaxyScene'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-blue-500 animate-pulse font-mono">INITIALIZING NEURAL FABRIC...</div>
    </div>
  ),
});

export default function GalaxyPage() {
  return <GalaxyScene />;
}
