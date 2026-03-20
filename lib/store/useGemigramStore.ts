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
 * Gemigram Global State Store
 * Centralized state management for the Gemigram AIOS.
 * Architecture: Sliced Pattern (Zustand)
 * Rules: 5 Slices - Sensory, Cognitive, Agent, Ui, Auth (Zero Deviation)
 */
export interface GemigramState extends SensorySlice, AgentSlice, UiSlice, CognitiveSlice, AuthSlice {}

export const useGemigramStore = create<GemigramState>()(
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
export const useUnreadNotifications = () => useGemigramStore((state) => state.unreadNotifications);
export const useUnreadNotificationsCount = () => useGemigramStore((state) => state.unreadNotifications.length);
export const useOwnedAgents = () => useGemigramStore((state) => state.agents);
