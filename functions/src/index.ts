import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import { spawn } from "child_process";
import { NeuralRouter, NeuralProvider, NeuralMessage, NeuralOptions } from "./neural";

admin.initializeApp();

export const syncAdminRole = onDocumentWritten("users/{userId}", async (event: any) => {
  const userId = event.params.userId;
  const snapshot = event.data;

  // If document was deleted, remove admin claim
  if (!snapshot || !snapshot.after || !snapshot.after.exists) {
    try {
      await admin.auth().setCustomUserClaims(userId, { admin: false });
    } catch (error) {
      console.error(`Error removing admin claim for ${userId}:`, error);
    }
    return;
  }

  const role = snapshot.after.data().role;
  const wasAdmin = snapshot.before && snapshot.before.exists ? snapshot.before.data().role === 'admin' : false;
  const isAdmin = role === 'admin';

  // Only update claims if the role actually changed to/from admin
  if (wasAdmin !== isAdmin) {
    try {
      await admin.auth().setCustomUserClaims(userId, { admin: isAdmin });
    } catch (error) {
      console.error(`Error updating custom claim for ${userId}:`, error);
    }
  }
});

/**
 * 🛰️ GWS Bridge (Neural Connectivity Layer)
 * 
 * This function acts as the sovereign execution environment for workspace tasks.
 * It translates JSON intents into production-grade `@googleworkspace/cli` calls.
 */
export const executeAgentTool = onRequest({ timeoutSeconds: 60, memory: "256MiB" }, async (req: any, res: any) => {
  // CORS Support for Firebase Hosting
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  const { toolId, action, params } = req.body;
  
  if (!toolId) {
    res.status(400).json({ status: "error", message: "Missing toolId substrate." });
    return;
  }

  // 1. Build Command Arguments
  const serviceName = toolId.replace('workspace_', ''); // e.g., 'workspace_gmail' -> 'gmail'
  const args = [serviceName, action];

  // 2. Inject Parameters safely
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        args.push(`--${key}`, String(value));
      }
    });
  }

  // 4. Execution via spawn (Sovereign Safety)
  try {
    const child = spawn('gws', args);
    let stdoutArr: Buffer[] = [];
    let stderrArr: Buffer[] = [];

    child.stdout.on('data', (data: Buffer) => { stdoutArr.push(data); });
    child.stderr.on('data', (data: Buffer) => { stderrArr.push(data); });

    const exitCode = await new Promise((resolve) => {
      child.on('close', resolve);
    });

    const stdout = Buffer.concat(stdoutArr).toString();
    const stderr = Buffer.concat(stderrArr).toString();

    if (exitCode !== 0) {
      console.warn(`[GWS-Bridge] Command failed with exit code ${exitCode}. Stderr: ${stderr}`);
    }

    // Try to parse as JSON, fallback to raw string
    try {
      const data = JSON.parse(stdout);
      res.json({ status: "success", toolId, action, data });
    } catch {
      res.json({ status: "success", toolId, action, rawOutput: stdout || stderr });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[GWS-Bridge] Critical Failure:`, errorMessage);
    res.status(500).json({ 
      status: "error", 
      message: "Neural routing failed.",
      details: errorMessage 
    });
  }
});

/**
 * 🧠 Neural Architecture Endpoint
 * 
 * Replaces the Next.js _api routes which are excluded from the static build.
 * Provides unified access to Gemini, Anthropic, and DeepSeek.
 */
export const neuralGenerate = onRequest({ 
  timeoutSeconds: 60, 
  memory: "512MiB",
  secrets: ["GEMINI_API_KEY", "ANTHROPIC_API_KEY", "DEEPSEEK_API_KEY"] 
}, async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { provider, messages, options } = req.body;
    
    if (!provider || !messages) {
      res.status(400).json({ error: "Missing substrate: provider or messages." });
      return;
    }

    const router = new NeuralRouter();
    const response = await router.generate(provider as NeuralProvider, messages as NeuralMessage[], options as NeuralOptions);

    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neural link failure.";
    console.error("[Neural_Generate_Error]:", error);
    res.status(500).json({ error: message });
  }
});
