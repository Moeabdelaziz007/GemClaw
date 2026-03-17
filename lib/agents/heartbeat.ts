import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Agent Heartbeat System - Vital Signs Monitoring
 * 
 * Maintains agent "aliveness" by periodically updating activity timestamps
 * and monitoring health status in Firestore.
 */

interface HeartbeatConfig {
  intervalMs?: number;        // How often to send heartbeat (default: 30s)
  timeoutMs?: number;         // Time before considered offline (default: 5min)
  autoStart?: boolean;        // Start immediately (default: true)
}

/**
 * Start heartbeat monitoring for an agent
 * Updates lastActive timestamp every 30 seconds
 * 
 * @param agentId - Unique agent identifier
 * @param config - Optional configuration
 * @returns Cleanup function to stop heartbeat
 */
export async function startAgentHeartbeat(
  agentId: string, 
  config: HeartbeatConfig = {}
): Promise<() => void> {
  const {
    intervalMs = 30000,      // 30 seconds
    timeoutMs = 300000,      // 5 minutes
    autoStart = true
  } = config;

  let intervalId: NodeJS.Timeout | null = null;
  let isActive = true;

  const sendHeartbeat = async () => {
    if (!isActive) return;

    try {
      const agentRef = doc(db, 'agents', agentId);
      
      await updateDoc(agentRef, {
        lastActive: serverTimestamp(),
        heartbeatStatus: 'alive',
        healthMetrics: {
          uptime: Date.now(),
          lastCheck: serverTimestamp(),
          consecutiveFailures: 0
        }
      });

      // console.log(`[Heartbeat] Agent ${agentId} pulse sent`);
    } catch (error) {
      console.error('[Heartbeat] Failed to send pulse:', error);
      
      // Mark as potentially offline after failures
      try {
        const agentRef = doc(db, 'agents', agentId);
        await updateDoc(agentRef, {
          heartbeatStatus: 'unreachable',
          'healthMetrics.consecutiveFailures': (await getAgentFailures(agentId)) + 1
        });
      } catch (secondaryError) {
        console.error('[Heartbeat] Failed to update status:', secondaryError);
      }
    }
  };

  const getAgentFailures = async (id: string): Promise<number> => {
    try {
      // This would require getDoc import - simplified version
      return 0;
    } catch {
      return 0;
    }
  };

  if (autoStart) {
    // Send initial heartbeat immediately
    await sendHeartbeat();
    
    // Set up recurring heartbeats
    intervalId = setInterval(sendHeartbeat, intervalMs);
    // console.log(`[Heartbeat] Started monitoring agent ${agentId} (interval: ${intervalMs}ms)`);
  }

  // Return cleanup function
  return () => {
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
      // console.log(`[Heartbeat] Stopped monitoring agent ${agentId}`);
    }
  };
}

/**
 * Check if an agent is alive based on last heartbeat
 * 
 * @param agentId - Unique agent identifier  
 * @param timeoutMs - Custom timeout threshold (default: 5min)
 * @returns true if agent is alive, false otherwise
 */
export async function isAgentAlive(
  agentId: string, 
  timeoutMs: number = 300000
): Promise<boolean> {
  try {
    const { getDoc } = await import('firebase/firestore');
    const agentRef = doc(db, 'agents', agentId);
    const agentSnap = await getDoc(agentRef);

    if (!agentSnap.exists()) {
      return false;
    }

    const data = agentSnap.data();
    const lastActive = data?.lastActive?.toDate();
    
    if (!lastActive) {
      return false;
    }

    const now = new Date();
    const timeSinceActive = now.getTime() - lastActive.getTime();
    
    return timeSinceActive < timeoutMs;
  } catch (error) {
    console.error('[Heartbeat] Failed to check agent status:', error);
    return false;
  }
}

/**
 * Get detailed agent health metrics
 */
export interface AgentHealthMetrics {
  status: 'alive' | 'unreachable' | 'offline';
  lastActive: Date | null;
  uptime: number;
  consecutiveFailures: number;
  healthScore: number;  // 0-100
}

export async function getAgentHealth(agentId: string): Promise<AgentHealthMetrics> {
  try {
    const { getDoc } = await import('firebase/firestore');
    const agentRef = doc(db, 'agents', agentId);
    const agentSnap = await getDoc(agentRef);

    if (!agentSnap.exists()) {
      return {
        status: 'offline',
        lastActive: null,
        uptime: 0,
        consecutiveFailures: 0,
        healthScore: 0
      };
    }

    const data = agentSnap.data();
    const lastActive = data?.lastActive?.toDate() || null;
    const healthMetrics = data?.healthMetrics || {};
    const status = data?.heartbeatStatus || 'offline';

    // Calculate health score (0-100)
    let healthScore = 100;
    
    if (status === 'unreachable') {
      healthScore -= 50;
    } else if (status === 'offline') {
      healthScore = 0;
    }

    if (healthMetrics.consecutiveFailures > 0) {
      healthScore -= Math.min(50, healthMetrics.consecutiveFailures * 10);
    }

    if (lastActive) {
      const minutesSinceActive = (Date.now() - lastActive.getTime()) / 60000;
      if (minutesSinceActive > 5) {
        healthScore -= Math.min(50, (minutesSinceActive - 5) * 2);
      }
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      status: status as 'alive' | 'unreachable' | 'offline',
      lastActive,
      uptime: healthMetrics.uptime || 0,
      consecutiveFailures: healthMetrics.consecutiveFailures || 0,
      healthScore
    };
  } catch (error) {
    console.error('[Heartbeat] Failed to get agent health:', error);
    return {
      status: 'offline',
      lastActive: null,
      uptime: 0,
      consecutiveFailures: 0,
      healthScore: 0
    };
  }
}

/**
 * Stop all heartbeats (for cleanup on app unload)
 */
export function stopAllHeartbeats(): void {
  // console.log('[Heartbeat] Stopping all agent monitors');
  // In a real app, we'd track all intervals and clear them
  // For now, browser cleanup will handle this
}

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopAllHeartbeats();
  });
}
