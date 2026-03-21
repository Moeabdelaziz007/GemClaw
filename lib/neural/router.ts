import { NeuralMessage, NeuralOptions, NeuralResponse, NeuralProvider } from "./types";

/**
 * Sovereign Neural Router
 * Routes AI execution to the Server-Side Proxy (`/api/neural/router`)
 * Ensures 100% Client-Side zero-exposure of API Keys.
 */
export class NeuralRouter {
  
  async generate(
    provider: NeuralProvider,
    messages: NeuralMessage[],
    options: NeuralOptions = {}
  ): Promise<NeuralResponse> {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/neural/router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider, messages, options })
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          console.warn("[NeuralRouter] Could not parse error response JSON", e);
        }
        throw new Error(`[NeuralRouter Proxy Rejected]: ${errorMsg}`);
      }

      const data = await response.json();
      
      // Override latency to measure total roundtrip
      data.latencyMs = Date.now() - startTime;
      
      return data as NeuralResponse;
    } catch (error) {
      console.error(`[NeuralRouter] ❌ Failed to route to ${provider} proxy:`, error);
      throw error;
    }
  }
}
