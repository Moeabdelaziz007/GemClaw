import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createSensorySlice, type SensorySlice } from './slices/createSensorySlice';
import { createAgentSlice, type AgentSlice } from './slices/createAgentSlice';
import { createUiSlice, type UiSlice } from './slices/createUiSlice';
import { createCognitiveSlice, type CognitiveSlice } from './slices/createCognitiveSlice';
import type { Notification } from '@/lib/types/models';

interface AuthSlice {
  hydratedUserId: string | null;
  unreadNotifications: Notification[];
  setHydratedUserId: (userId: string | null) => void;
  setUnreadNotifications: (notifications: Notification[]) => void;
  clearUserScopedState: () => void;
}

export interface AetherState extends SensorySlice, AgentSlice, UiSlice, CognitiveSlice, AuthSlice {}

const USER_SCOPED_DEFAULTS = {
  hydratedUserId: null,
  unreadNotifications: [] as Notification[],
  activeProjectId: null,
  userProjects: [],
  agents: [],
  activeAgentId: null,
  transcript: [],
  streamingBuffer: '',
  isInterrupted: false,
  isThinking: false,
  isSpeaking: false,
  contextUsage: 0,
  sessionState: 'INITIALIZING' as const,
  sessionMetadata: null,
  consecutiveErrors: 0,
  micLevel: 0,
  speakerLevel: 0,
  latencyMs: 0,
  isVisionActive: false,
  tokensUsed: 0,
  tokenBudget: 1_000_000,
  pendingManifest: null,
};

export const useAetherStore = create<AetherState>()(
  persist(
    (set, get, api) => ({
      ...createSensorySlice(set, get, api),
      ...createAgentSlice(set, get, api),
      ...createUiSlice(set, get, api),
      ...createCognitiveSlice(set, get, api),
      hydratedUserId: null,
      unreadNotifications: [],
      setHydratedUserId: (userId) => set({ hydratedUserId: userId }),
      setUnreadNotifications: (notifications) => set({ unreadNotifications: notifications }),
      clearUserScopedState: () => set({ ...USER_SCOPED_DEFAULTS }),
    }),
    {
      name: 'aether-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        linkType: state.linkType,
        voiceProfile: state.voiceProfile,
        voiceSession: state.voiceSession,
      }),
    }
  )
);

export const useUnreadNotifications = () => useAetherStore((state) => state.unreadNotifications);
export const useUnreadNotificationsCount = () => useAetherStore((state) => state.unreadNotifications.length);
export const useOwnedAgents = () => useAetherStore((state) => state.agents);

export type { TranscriptMessage } from './slices/createSensorySlice';
export type { Agent, ProjectMetadata } from './slices/createAgentSlice';
export type { SessionState, SessionMetadata } from './slices/createCognitiveSlice';
