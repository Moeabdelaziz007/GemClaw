/**
 * 🛰️ Aether Local-Spine Bridge
 * 
 * This script runs on your local machine to provide $0 cost GWS execution.
 * It listens for requests from the AetherOS frontend and executes 'gws' commands.
 * 
 * Usage: npx ts-node scripts/aether-local-bridge.ts
 */

import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = 9999;

app.use(cors());
app.use(express.json());

console.log(`
  🧬 Aether Local-Spine Bridge Initialized
  ---------------------------------------
  Status: Sovereign & Local
  Port: ${PORT}
  Cost: $0.00
`);

app.get('/status', (req, res) => {
  res.json({ 
    status: "active", 
    version: "2.0.0", 
    mode: "sovereign-local",
    timestamp: new RegExp(new Date().toISOString())
  });
});

app.post('/execute', async (req, res) => {
  const { toolId, action, params, persona } = req.body;
  
  if (!toolId) {
    return res.status(400).json({ status: "error", message: "Missing toolId." });
  }

  console.log(`[Local-Spine] Persona: ${persona} | Executing: ${toolId} ${action}`);

  // 1. Build Command
  const serviceName = toolId.replace('workspace_', '');
  let finalCommand = `gws ${serviceName} ${action}`;

  // 2. Inject Params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) finalCommand += ` --${key} "${value}"`;
    });
  }

  // 3. Command Line Execution
  try {
    const { stdout, stderr } = await execAsync(finalCommand);
    
    if (stderr && !stdout) {
      console.warn(`[Local-Spine] Stderr: ${stderr}`);
    }

    try {
      const data = JSON.parse(stdout);
      res.json({ status: "success", toolId, action, data });
    } catch (e) {
      res.json({ status: "success", toolId, action, rawOutput: stdout });
    }
  } catch (err: any) {
    console.error(`[Local-Spine] Execution Error:`, err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Neural Spine listening at http://localhost:${PORT}`);
});
