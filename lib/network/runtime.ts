const DEFAULT_LOCAL_BRIDGE_ORIGIN = 'http://127.0.0.1:9999';
const DEFAULT_TIMEOUT_MS = 3000;

export type NetworkFailureKind = 'timeout' | 'offline' | 'cors' | 'permission_denied' | 'http_error' | 'unknown';

export interface NetworkFailure {
  kind: NetworkFailureKind;
  message: string;
  status?: number;
  cause?: unknown;
}

export class HttpStatusError extends Error {
  constructor(public status: number, public statusText: string, public body?: string) {
    super(`HTTP ${status}${statusText ? ` ${statusText}` : ''}`.trim());
    this.name = 'HttpStatusError';
  }
}

function getEnvFlag(value?: string): boolean {
  return value === 'true';
}

function parsePositiveInt(value?: string, fallback = 0): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getLocationHostname(): string | null {
  if (typeof window === 'undefined') return null;
  return window.location.hostname;
}

export function isLocalHostname(hostname?: string | null): boolean {
  if (!hostname) return false;
  return ['localhost', '127.0.0.1', '::1'].includes(hostname);
}

export function getLocalBridgeOrigin(): string | null {
  const configuredOrigin = process.env.NEXT_PUBLIC_LOCAL_BRIDGE_ORIGIN?.trim();
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, '');
  }

  return isLocalHostname(getLocationHostname()) ? DEFAULT_LOCAL_BRIDGE_ORIGIN : null;
}

export function getLocalBridgeUrl(path: string): string | null {
  const origin = getLocalBridgeOrigin();
  if (!origin) return null;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

export function isBridgeCheckEnabled(): boolean {
  return getEnvFlag(process.env.NEXT_PUBLIC_ENABLE_BRIDGE_CHECK) && Boolean(getLocalBridgeOrigin());
}

export function isLocalBridgeExecutionEnabled(): boolean {
  if (!getLocalBridgeOrigin()) return false;

  if (process.env.NEXT_PUBLIC_ENABLE_LOCAL_BRIDGE === 'false') {
    return false;
  }

  if (getEnvFlag(process.env.NEXT_PUBLIC_ENABLE_LOCAL_BRIDGE)) {
    return true;
  }

  return isLocalHostname(getLocationHostname());
}

export function getTelemetryEndpoint(): string | null {
  const endpoint = process.env.NEXT_PUBLIC_TELEMETRY_ENDPOINT?.trim();
  return endpoint || null;
}

export function getTelemetryPollIntervalMs(): number {
  return parsePositiveInt(process.env.NEXT_PUBLIC_TELEMETRY_POLL_MS, 0);
}

export function getNetworkTimeoutMs(value?: string, fallback = DEFAULT_TIMEOUT_MS): number {
  return parsePositiveInt(value, fallback) || fallback;
}

export function normalizeNetworkError(error: unknown): NetworkFailure {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      kind: 'offline',
      message: 'Network unavailable. Check your connection and retry.',
      cause: error,
    };
  }

  if (error instanceof HttpStatusError) {
    return {
      kind: 'http_error',
      message: `Request failed with status ${error.status}.`,
      status: error.status,
      cause: error,
    };
  }

  if (error instanceof DOMException) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return { kind: 'timeout', message: 'Request timed out before the service responded.', cause: error };
    }

    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return { kind: 'permission_denied', message: 'Permission denied while accessing the requested capability.', cause: error };
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('timeout') || message.includes('timed out') || error.name === 'AbortError') {
      return { kind: 'timeout', message: 'Request timed out before the service responded.', cause: error };
    }

    if (message.includes('permission denied') || message.includes('notallowederror')) {
      return { kind: 'permission_denied', message: 'Permission denied while accessing the requested capability.', cause: error };
    }

    if (message.includes('failed to fetch') || message.includes('load failed') || message.includes('cors')) {
      return {
        kind: 'cors',
        message: 'Request was blocked by the browser, a CORS policy, or an unavailable cross-origin service.',
        cause: error,
      };
    }

    return { kind: 'unknown', message: error.message, cause: error };
  }

  return { kind: 'unknown', message: 'Unexpected network failure.', cause: error };
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => undefined);
      throw new HttpStatusError(response.status, response.statusText, body);
    }

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
