import { onRequest } from "firebase-functions/v2/https";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const executeAgentTool = onRequest(async (req, res) => {
  const { toolName, action, params } = req.body;

  // Map tool/action to gws command
  let command = "";
  switch (toolName) {
    case "workspace_email_manager":
      command = `gws gmail +${action}`;
      break;
    case "workspace_calendar_manager":
      command = `gws calendar +${action}`;
      break;
    case "workspace_tasks_manager":
      command = `gws tasks ${action}`;
      break;
    default:
      res.status(400).json({ error: "Unknown tool" });
      return;
  }

  // Add params (simplified for demo)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      command += ` --${key} "${value}"`;
    });
  }

  try {
    const { stdout } = await execAsync(command);
    res.json(JSON.parse(stdout));
  } catch (error) {
    res.status(500).json({ error: "Execution failed", details: error });
  }
});
