// tests/bridge.test.ts
function mapToolToCommand(toolName: string, action: string, params: any): string {
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
      throw new Error("Unknown tool");
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      command += ` --${key} "${value}"`;
    });
  }
  return command;
}

// Tests
const tests = [
  { tool: "workspace_email_manager", action: "send", params: { to: "a@b.com" }, expected: 'gws gmail +send --to "a@b.com"' },
  { tool: "workspace_calendar_manager", action: "agenda", params: {}, expected: 'gws calendar +agenda' },
  { tool: "workspace_tasks_manager", action: "add", params: { title: "Buy milk" }, expected: 'gws tasks add --title "Buy milk"' }
];

tests.forEach(t => {
  const cmd = mapToolToCommand(t.tool, t.action, t.params);
  if (cmd !== t.expected) {
    console.error(`FAILED: Expected ${t.expected}, got ${cmd}`);
    process.exit(1);
  } else {
    // console.log(`PASSED: ${t.tool} ${t.action}`);
  }
});
