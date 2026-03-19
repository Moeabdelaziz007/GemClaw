/**
 * Sovereign AI Bridge
 * Refactored to use Internal API Proxy to secure credentials.
 * Following v3.0 Security Rules (No client-side keys).
 */

export const runSovereignReasoning = async (prompt: string, context?: string) => {
  try {
    const response = await fetch("/api/gemini/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Neural bridge communication failure.");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("[Sovereign_Link_Failure]:", error);
    throw error;
  }
};

export const generateText = runSovereignReasoning;

/**
 * Streaming Link for real-time agent output
 * TODO: Implement server-side streaming endpoint if needed.
 * Currently falling back to standard reasoning for safety.
 */
export const streamSovereignReasoning = async (prompt: string, onChunk: (chunk: string) => void) => {
  try {
    const text = await runSovereignReasoning(prompt);
    // Simulate streaming for UI compatibility
    const words = text.split(" ");
    for (const word of words) {
      onChunk(word + " ");
      await new Promise((resolve) => setTimeout(resolve, 20)); // Subtle micro-animation delay
    }
  } catch (error) {
    console.error("[Sovereign_Stream_Failure]:", error);
    throw error;
  }
};
