'use client';

import { useState } from 'react';
import { useAuth } from '@/components/Providers';
import { useAetherStore, Agent } from '@/lib/store/useAetherStore';
import CreateAgentForm from '@/components/CreateAgentForm';
import ForgeChamber from '@/components/ForgeChamber';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';

export default function ForgePage() {
  const { user } = useAuth();
  const { setActiveAgentId } = useAetherStore();
  const [isForging, setIsForging] = useState(false);
  const [pendingAgentData, setPendingAgentData] = useState<any>(null);
  const router = useRouter();

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
      role: data.description,
      users: '0',
      seed: data.name.toLowerCase(),
      systemPrompt: data.systemPrompt,
      voiceName: data.voiceName,
      ownerId: user.uid,
      memory: data.memory,
      skills_desc: data.skills_desc,
      soul: data.soul,
      rules: data.rules,
      tools: data.tools,
      skills: data.skills,
    };

    try {
      await setDoc(doc(db, 'agents', agentId), {
        ...newAgent,
        createdAt: serverTimestamp()
      });
      
      setPendingAgentData(null);
      setIsForging(false);
      setActiveAgentId(agentId);
      router.push('/workspace');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
      setIsForging(false);
      router.push('/hub');
    }
  };

  return (
    <div className="w-full h-full">
      {!isForging ? (
        <CreateAgentForm onClose={() => router.push('/dashboard')} onSubmit={handleCreateAgent} />
      ) : (
        <ForgeChamber onComplete={handleForgeComplete} />
      )}
    </div>
  );
}
