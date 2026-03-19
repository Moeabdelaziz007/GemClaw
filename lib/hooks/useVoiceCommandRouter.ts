import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGemigramStore } from '../store/useGemigramStore';

// ─── Interfaces ──────────────────────────────────────────────

export interface ToolCallEvent {
  name: string;
  args: Record<string, unknown>;
  callId: string;
}

export interface ToolCallResult {
  callId: string;
  success: boolean;
  error?: string;
}

// ─── Gemini Function Declarations ───────────────────────────

export const GEMINI_ROUTER_TOOLS = [
  {
    name: 'navigate_to_stage',
    description: 'Changes the voice interaction stage (e.g., from landing to workspace).',
    parameters: {
      type: 'OBJECT',
      properties: {
        stage: { type: 'string', enum: ['landing', 'forge', 'workspace'] },
        reason: { type: 'string', description: 'Contextual reason for navigation' }
      },
      required: ['stage', 'reason']
    }
  },
  {
    name: 'navigate_to_route',
    description: 'Navigates to a specific system route.',
    parameters: {
      type: 'OBJECT',
      properties: {
        route: { type: 'string', enum: ['/hub', '/galaxy', '/analyzer', '/settings', '/marketplace'] },
        reason: { type: 'string', description: 'Contextual reason for navigation' }
      },
      required: ['route', 'reason']
    }
  },
  {
    name: 'activate_agent',
    description: 'Switches the active Sovereign Intelligence.',
    parameters: {
      type: 'OBJECT',
      properties: {
        agentId: { type: 'string' },
        context: { type: 'string' }
      },
      required: ['agentId']
    }
  },
  {
    name: 'create_agent',
    description: 'Synthesizes a new agent manifest in the Forge.',
    parameters: {
      type: 'OBJECT',
      properties: {
        manifest: {
          type: 'OBJECT',
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            systemPrompt: { type: 'string' },
            voiceName: { type: 'string', enum: ['Charon', 'Puck', 'Kore', 'Fenrir'] },
            tools: { type: 'OBJECT' },
            skills: { type: 'OBJECT' }
          },
          required: ['name', 'role', 'systemPrompt', 'voiceName']
        }
      },
      required: ['manifest']
    }
  },
  {
    name: 'set_nav_visibility',
    description: 'Controls the visibility of secondary navigation elements.',
    parameters: {
      type: 'OBJECT',
      properties: {
        visible: { type: 'boolean' },
        trigger: { type: 'string', enum: ['voice', 'timeout', 'gesture'] }
      },
      required: ['visible', 'trigger']
    }
  },
  {
    name: 'system_command',
    description: 'Executes low-level system operations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        cmd: { type: 'string', enum: ['shutdown', 'recover', 'handoff'] },
        payload: { type: 'OBJECT' }
      },
      required: ['cmd']
    }
  }
];

// ─── Intent Engine Hook ─────────────────────────────────────

/**
 * useVoiceCommandRouter - The single entry point for all Gemini ToolCalls.
 * Implements FIFO queue, debouncing, and state dispatching.
 */
export function useVoiceCommandRouter() {
  const router = useRouter();
  const store = useGemigramStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDispatchedTool, setLastDispatchedTool] = useState<string | null>(null);
  const [queueLength, setQueueLength] = useState(0);

  const queueRef = useRef<ToolCallEvent[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Process Tool Call implementation
  const executeToolCall = useCallback(async (event: ToolCallEvent): Promise<ToolCallResult> => {
    const { name, args, callId } = event;
    
    // Log dispatch to Cognitive Session
    store.updateSessionMetadata({ 
      lastActivity: Date.now(),
      activeWidgets: [...(store.sessionMetadata?.activeWidgets || []), name]
    });

    console.log(`[IntentEngine] Dispatching: ${name}`, args);

    try {
      switch (name) {
        case 'navigate_to_stage': {
          const stage = args.stage as 'landing' | 'forge' | 'workspace';
          store.setVoiceSession({ stage, lastVoiceAction: `NAV_TO_STAGE_${stage}` });
          return { callId, success: true };
        }

        case 'navigate_to_route': {
          const route = args.route as string;
          // 150ms debounce for route navigation
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = setTimeout(() => {
            router.push(route);
          }, 150);
          return { callId, success: true };
        }

        case 'activate_agent': {
          const agentId = args.agentId as string;
          store.setActiveAgentId(agentId);
          return { callId, success: true };
        }

        case 'create_agent': {
          const manifest = args.manifest as any;
          store.setPendingManifest(manifest);
          store.setVoiceSession({ stage: 'forge', lastVoiceAction: 'CREATE_AGENT' });
          return { callId, success: true };
        }

        case 'system_command': {
          const cmd = args.cmd as string;
          if (cmd === 'shutdown') store.setSessionState('SHUTDOWN');
          if (cmd === 'recover') store.setSessionState('RECOVERING');
          return { callId, success: true };
        }

        default:
          return { callId, success: false, error: `Tool ${name} not implemented.` };
      }
    } catch (err) {
      return { callId, success: false, error: String(err) };
    }
  }, [router, store]);

  // FIFO Queue Processor
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessing || queueRef.current.length === 0) return;

      setIsProcessing(true);
      const event = queueRef.current.shift();
      setQueueLength(queueRef.current.length);

      if (event) {
        setLastDispatchedTool(event.name);
        await executeToolCall(event);
      }

      setIsProcessing(false);
    };

    const interval = setInterval(processQueue, 50);
    return () => clearInterval(interval);
  }, [isProcessing, executeToolCall]);

  // Public Dispatcher (to be wired to Live API hook)
  const dispatchToolCall = (event: ToolCallEvent) => {
    queueRef.current.push(event);
    setQueueLength(queueRef.current.length);
  };

  return {
    isProcessing,
    lastDispatchedTool,
    queueLength,
    dispatchToolCall
  };
}
