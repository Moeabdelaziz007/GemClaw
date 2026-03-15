/**
 * Telemetry Slice — Real-time AI Session Metrics
 * 
 * Tracks audio levels, latency, vision state, and affective scores.
 * Inspired by the Aether-Voice-OS TelemetrySlice pattern with
 * optimized selectors for zero-waste re-renders.
 */

export interface TelemetrySliceState {
  micLevel: number;         // 0-1, from user's AnalyserNode
  speakerLevel: number;     // 0-1, from AI audio playback
  latencyMs: number;        // Round-trip latency estimate
  isVisionActive: boolean;  // Whether screen capture is streaming
  lastVisionPulse: number;  // Timestamp of last vision frame
  frustrationScore: number; // 0-1, from Thalamic Gate streak
  tokenBudget: number;      // Total token limit
  tokensUsed: number;       // Current consumption
}

export interface TelemetrySliceActions {
  setMicLevel: (level: number) => void;
  setSpeakerLevel: (level: number) => void;
  setLatencyMs: (ms: number) => void;
  setVisionActive: (active: boolean) => void;
  setLastVisionPulse: (timestamp: number) => void;
  setFrustrationScore: (score: number) => void;
  trackTokenUsage: (tokens: number) => void;
  resetTelemetry: () => void;
}

export type TelemetrySlice = TelemetrySliceState & TelemetrySliceActions;

const INITIAL_TELEMETRY: TelemetrySliceState = {
  micLevel: 0,
  speakerLevel: 0,
  latencyMs: 0,
  isVisionActive: false,
  lastVisionPulse: 0,
  frustrationScore: 0,
  tokenBudget: 1_000_000, // Gemini 2.0 Flash 1M context
  tokensUsed: 0,
};

export const createTelemetrySlice = (
  set: (partial: Partial<TelemetrySlice> | ((state: TelemetrySlice) => Partial<TelemetrySlice>)) => void,
  get: () => TelemetrySlice
): TelemetrySlice => ({
  ...INITIAL_TELEMETRY,

  setMicLevel: (level) => set({ micLevel: Math.max(0, Math.min(1, level)) }),
  setSpeakerLevel: (level) => set({ speakerLevel: Math.max(0, Math.min(1, level)) }),
  setLatencyMs: (ms) => set({ latencyMs: Math.max(0, ms) }),
  setVisionActive: (active) => set({ isVisionActive: active }),
  setLastVisionPulse: (timestamp) => set({ lastVisionPulse: timestamp }),
  setFrustrationScore: (score) => set({ frustrationScore: Math.max(0, Math.min(1, score)) }),

  trackTokenUsage: (tokens: number) => {
    const current = get();
    const newUsed = current.tokensUsed + tokens;
    set({ tokensUsed: newUsed });

    if (newUsed > current.tokenBudget * 0.9) {
      console.warn(`[Telemetry] Token budget at ${((newUsed / current.tokenBudget) * 100).toFixed(1)}%`);
    }
  },

  resetTelemetry: () => set(INITIAL_TELEMETRY),
});
