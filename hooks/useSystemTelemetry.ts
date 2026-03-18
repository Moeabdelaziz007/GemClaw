'use client';

import { useState, useEffect } from 'react';
import { fetchWithTimeout, getNetworkTimeoutMs, getTelemetryEndpoint, getTelemetryPollIntervalMs, normalizeNetworkError } from '@/lib/network/runtime';

export interface SystemTelemetry {
  weather: {
    temp: number;
    condition: string;
    city: string;
  };
  latency: number;
  uptime: number;
  activeAgents: number;
}

const DEFAULT_TELEMETRY: SystemTelemetry = {
  weather: { temp: 0, condition: 'Unavailable', city: 'Local' },
  latency: 0,
  uptime: 0,
  activeAgents: 0,
};

export function useSystemTelemetry() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>(DEFAULT_TELEMETRY);

  useEffect(() => {
    const startedAt = Date.now();
    const uptimeTimer = window.setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        uptime: Math.floor((Date.now() - startedAt) / 1000),
      }));
    }, 1000);

    return () => window.clearInterval(uptimeTimer);
  }, []);

  useEffect(() => {
    const telemetryEndpoint = getTelemetryEndpoint();
    if (!telemetryEndpoint) {
      return;
    }

    const timeoutMs = getNetworkTimeoutMs(process.env.NEXT_PUBLIC_TELEMETRY_TIMEOUT_MS, 2500);
    const pollIntervalMs = getTelemetryPollIntervalMs();
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const loadTelemetry = async () => {
      const requestStartedAt = performance.now();

      try {
        const response = await fetchWithTimeout(
          telemetryEndpoint,
          {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          },
          timeoutMs
        );

        const payload = await response.json() as Partial<SystemTelemetry>;
        if (cancelled) {
          return;
        }

        const measuredLatency = Math.round(performance.now() - requestStartedAt);

        setTelemetry(prev => ({
          weather: {
            temp: payload.weather?.temp ?? prev.weather.temp,
            condition: payload.weather?.condition ?? prev.weather.condition,
            city: payload.weather?.city ?? prev.weather.city,
          },
          latency: typeof payload.latency === 'number' ? payload.latency : measuredLatency,
          uptime: prev.uptime,
          activeAgents: typeof payload.activeAgents === 'number' ? payload.activeAgents : prev.activeAgents,
        }));
      } catch (error) {
        const failure = normalizeNetworkError(error);
        console.warn('[Telemetry] Optional telemetry request skipped:', failure.kind, failure.message);
      } finally {
        if (!cancelled && pollIntervalMs > 0) {
          pollTimer = setTimeout(() => {
            void loadTelemetry();
          }, pollIntervalMs);
        }
      }
    };

    void loadTelemetry();

    return () => {
      cancelled = true;
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, []);

  return telemetry;
}
