import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSensorySlice, SensorySlice } from './slices/createSensorySlice';
import { createAgentSlice, AgentSlice, Agent } from './slices/createAgentSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';
import { createCognitiveSlice, CognitiveSlice } from './slices/createCognitiveSlice';
import { createAuthSlice, AuthSlice } from './slices/createAuthSlice';

// Re-export Agent type for convenience
export type { Agent };

/**
 * Gemclaw Global State Store
 * Centralized state management for the Gemclaw AIOS.
 * Architecture: Sliced Pattern (Zustand)
 * Rules: 5 Slices - Sensory, Cognitive, Agent, Ui, Auth (Zero Deviation)
 */
export interface GemclawState extends SensorySlice, AgentSlice, UiSlice, CognitiveSlice, AuthSlice {}

export const useGemclawStore = create<GemclawState>()(
  persist(
    (...a) => ({
      ...createSensorySlice(...a),
      ...createAgentSlice(...a),
      ...createUiSlice(...a),
      ...createCognitiveSlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: 'gemigram-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        agents: state.agents,
        activeAgentId: state.activeAgentId,
        unreadNotifications: state.unreadNotifications,
        hydratedUserId: state.hydratedUserId,
      }),
    }
  )
);

// High-performance Selectors
export const useUnreadNotifications = () => useGemclawStore((state) => state.unreadNotifications);
export const useUnreadNotificationsCount = () => useGemclawStore((state) => state.unreadNotifications.length);
export const useOwnedAgents = () => useGemclawStore((state) => state.agents);
