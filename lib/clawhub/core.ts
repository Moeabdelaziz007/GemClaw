/**
 * 🛰️ ClawHub TS Logic (Phase 1.2)
 *
 * This file contains the foundational TypeScript logic for ClawHub,
 * ThalamicGate, GalaxyOrchestration, and SensoryOrchestrator ported
 * from Aether-Voice-OS.
 *
 * NOTE: These orchestrators run locally in the client/React layer for now,
 * and will be migrated to the Go backend for true concurrency in Phase 3.
 */

import { useGemclawStore } from '@/lib/store/useGemclawStore';

// 1. ClawHub
export class ClawHub {
  private static instance: ClawHub;

  private constructor() {}

  public static getInstance(): ClawHub {
    if (!ClawHub.instance) {
      ClawHub.instance = new ClawHub();
    }
    return ClawHub.instance;
  }

  public registerAgent(agent: any) {
    const { hydrateAgent } = useGemclawStore.getState();
    hydrateAgent(agent);
    console.log(`[ClawHub] Agent ${agent.id} registered and hydrated.`);
  }

  public getAgent(agentId: string) {
    const { agents } = useGemclawStore.getState();
    return agents.find((a) => a.id === agentId) || null;
  }
}

// 2. Thalamic Gate
export class ThalamicGate {
  public static routeSignal(signal: any) {
    console.log(`[ThalamicGate] Routing signal:`, signal);
    
    // Example: Route signal based on Intent or Handoff Request
    if (signal?.type === 'HANDOFF_REQUEST') {
      const { setSessionState, updateSessionMetadata, sessionMetadata } = useGemclawStore.getState();
      setSessionState('HANDING_OFF');
      if (sessionMetadata) {
        updateSessionMetadata({ handoffCount: sessionMetadata.handoffCount + 1 });
      }
      return { target: signal.targetAgentId, payload: signal };
    }

    return { target: 'default', payload: signal };
  }
}

// 3. Galaxy Orchestration
export class GalaxyOrchestration {
  public static syncConstellation(activeAgentIds: string[]) {
    console.log(`[GalaxyOrchestration] Syncing constellation for:`, activeAgentIds);
    // Track active orchestrated agents via the activeWidgets array as a proxy to stay store-compliant
    const { updateSessionMetadata } = useGemclawStore.getState();
    updateSessionMetadata({ activeWidgets: activeAgentIds });
  }
}

// 4. Sensory Orchestrator
export class SensoryOrchestrator {
  public static processAudioStream(streamData: any) {
    // Basic processing hook for UI responsiveness
    const { setMicLevel, setLatencyMs } = useGemclawStore.getState();
    
    // Simulate real-time metrics update based on incoming stream
    if (streamData?.rms !== undefined) {
      setMicLevel(streamData.rms);
    }
    if (streamData?.latency !== undefined) {
      setLatencyMs(streamData.latency);
    }
  }
}

export const orchestratorInstance = {
  clawHub: ClawHub.getInstance(),
  route: ThalamicGate.routeSignal,
  sync: GalaxyOrchestration.syncConstellation,
  sense: SensoryOrchestrator.processAudioStream,
};
