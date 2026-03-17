import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSensorySlice, SensorySlice } from './slices/createSensorySlice';
import { createAgentSlice, AgentSlice } from './slices/createAgentSlice';
import { createUiSlice, UiSlice } from './slices/createUiSlice';
import { createCognitiveSlice, CognitiveSlice } from './slices/createCognitiveSlice';

export interface AetherState extends SensorySlice, AgentSlice, UiSlice, CognitiveSlice {}

export const useAetherStore = create<AetherState>()(
  persist(
    (set, get, api) => ({
      ...createSensorySlice(set, get, api),
      ...createAgentSlice(set, get, api),
      ...createUiSlice(set, get, api),
      ...createCognitiveSlice(set, get, api),
    }),
    {
      name: 'aether-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Re-export types for convenience
export type { TranscriptMessage } from './slices/createSensorySlice';
export type { Agent, ProjectMetadata } from './slices/createAgentSlice';
export type { SessionState, SessionMetadata } from './slices/createCognitiveSlice';
