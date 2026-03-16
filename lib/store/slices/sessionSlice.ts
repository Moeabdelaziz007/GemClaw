/**
 * Session State Machine — Atomic Transitions with Recovery
 * 
 * Ported from Aether-Voice-OS session_state.py and adapted for
 * browser-native Zustand state management.
 * 
 * Implements a formal FSM with:
 * - Validated state transitions
 * - Health monitoring with auto-recovery
 * - Session metadata tracking
 * - Snapshot/restore for crash recovery (persisted to localStorage)
 */

// ─── Session States ─────────────────────────────────────────
export type SessionState =
  | 'INITIALIZING'
  | 'CONNECTED'
  | 'HANDING_OFF'
  | 'RESTARTING'
  | 'ERROR'
  | 'RECOVERING'
  | 'SHUTDOWN';

// ─── Valid Transitions Map ──────────────────────────────────
const VALID_TRANSITIONS: Record<SessionState, SessionState[]> = {
  INITIALIZING: ['CONNECTED', 'ERROR', 'SHUTDOWN'],
  CONNECTED: ['HANDING_OFF', 'ERROR', 'SHUTDOWN'],
  HANDING_OFF: ['RESTARTING', 'ERROR'],
  RESTARTING: ['INITIALIZING', 'ERROR'],
  ERROR: ['RECOVERING', 'SHUTDOWN'],
  RECOVERING: ['INITIALIZING', 'ERROR', 'SHUTDOWN'],
  SHUTDOWN: [], // Terminal state
};

// ─── Session Metadata ───────────────────────────────────────
export interface SessionMetadata {
  sessionId: string;
  activeAgentName: string;
  startedAt: number; // epoch ms
  messageCount: number;
  handoffCount: number;
  errorCount: number;
  lastActivity: number; // epoch ms
  activeWidgets: string[];
}

// ─── Session Snapshot ───────────────────────────────────────
export interface SessionSnapshot {
  state: SessionState;
  metadata: SessionMetadata | null;
  consecutiveErrors: number;
  timestamp: number;
}

// ─── Session Slice State & Actions ──────────────────────────
export interface SessionSliceState {
  sessionState: SessionState;
  sessionMetadata: SessionMetadata | null;
  consecutiveErrors: number;
  maxConsecutiveErrors: number;
  lastSnapshot: SessionSnapshot | null;
  stateTransitionLog: { from: SessionState; to: SessionState; reason: string; time: number }[];
}

export interface SessionSliceActions {
  transitionTo: (newState: SessionState, reason?: string) => boolean;
  initSession: (agentName: string) => void;
  incrementMessageCount: () => void;
  incrementHandoffCount: () => void;
  updateActiveWidgets: (widgets: string[]) => void;
  createSnapshot: () => SessionSnapshot;
  restoreFromSnapshot: (snapshot: SessionSnapshot) => boolean;
  isTransitioning: () => boolean;
  shouldTriggerReconnection: () => boolean;
}

export type SessionSlice = SessionSliceState & SessionSliceActions;

// ─── Transition Validator ───────────────────────────────────
function isValidTransition(from: SessionState, to: SessionState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Generate Session ID ────────────────────────────────────
function generateSessionId(): string {
  return `ses-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

// ─── Slice Creator ──────────────────────────────────────────
export const createSessionSlice = (
  set: (partial: Partial<SessionSlice> | ((state: SessionSlice) => Partial<SessionSlice>)) => void,
  get: () => SessionSlice
): SessionSlice => ({
  // Initial State
  sessionState: 'INITIALIZING',
  sessionMetadata: null,
  consecutiveErrors: 0,
  maxConsecutiveErrors: 3,
  lastSnapshot: null,
  stateTransitionLog: [],

  // ── Actions ────────────────────────────────────────────────

  transitionTo: (newState: SessionState, reason: string = '') => {
    const current = get();
    const currentState = current.sessionState;

    if (!isValidTransition(currentState, newState)) {
      console.error(
        `[SessionFSM] Invalid transition: ${currentState} → ${newState} (reason: ${reason})`
      );
      return false;
    }

    const updates: Partial<SessionSlice> = {
      sessionState: newState,
      stateTransitionLog: [
        ...current.stateTransitionLog.slice(-19), // Keep last 20 transitions
        { from: currentState, to: newState, reason, time: Date.now() },
      ],
    };

    // Track errors
    if (newState === 'ERROR') {
      updates.consecutiveErrors = current.consecutiveErrors + 1;
      if (current.sessionMetadata) {
        updates.sessionMetadata = {
          ...current.sessionMetadata,
          errorCount: current.sessionMetadata.errorCount + 1,
          lastActivity: Date.now(),
        };
      }
    } else if (newState === 'CONNECTED') {
      updates.consecutiveErrors = 0;
    }

    // Update last activity on any transition
    if (current.sessionMetadata) {
      updates.sessionMetadata = {
        ...(updates.sessionMetadata || current.sessionMetadata),
        lastActivity: Date.now(),
      };
    }

    set(updates);
    return true;
  },

  initSession: (agentName: string) => {
    set({
      sessionState: 'INITIALIZING',
      sessionMetadata: {
        sessionId: generateSessionId(),
        activeAgentName: agentName,
        startedAt: Date.now(),
        messageCount: 0,
        handoffCount: 0,
        errorCount: 0,
        lastActivity: Date.now(),
        activeWidgets: [],
      },
      consecutiveErrors: 0,
      stateTransitionLog: [],
    });
  },

  incrementMessageCount: () => {
    const meta = get().sessionMetadata;
    if (meta) {
      set({
        sessionMetadata: {
          ...meta,
          messageCount: meta.messageCount + 1,
          lastActivity: Date.now(),
        },
      });
    }
  },

  incrementHandoffCount: () => {
    const meta = get().sessionMetadata;
    if (meta) {
      set({
        sessionMetadata: {
          ...meta,
          handoffCount: meta.handoffCount + 1,
          lastActivity: Date.now(),
        },
      });
    }
  },

  updateActiveWidgets: (widgets: string[]) => {
    const meta = get().sessionMetadata;
    if (meta) {
      set({
        sessionMetadata: {
          ...meta,
          activeWidgets: widgets,
          lastActivity: Date.now(),
        },
      });
    }
  },

  createSnapshot: () => {
    const current = get();
    const snapshot: SessionSnapshot = {
      state: current.sessionState,
      metadata: current.sessionMetadata ? { ...current.sessionMetadata } : null,
      consecutiveErrors: current.consecutiveErrors,
      timestamp: Date.now(),
    };
    set({ lastSnapshot: snapshot });
    return snapshot;
  },

  restoreFromSnapshot: (snapshot: SessionSnapshot) => {
    try {
      set({
        sessionState: 'INITIALIZING', // Always start fresh after restore
        sessionMetadata: snapshot.metadata ? { ...snapshot.metadata } : null,
        consecutiveErrors: 0,
      });
      return true;
    } catch (err) {
      console.error('[SessionFSM] Restore failed:', err);
      return false;
    }
  },

  isTransitioning: () => {
    const state = get().sessionState;
    return ['HANDING_OFF', 'RESTARTING', 'RECOVERING'].includes(state);
  },

  shouldTriggerReconnection: () => {
    const current = get();
    return (
      current.consecutiveErrors > 0 &&
      current.consecutiveErrors < current.maxConsecutiveErrors
    );
  },
});
