
/**
 * Aether GWS Client-Side Spine
 * 
 * Executes Google Workspace tasks directly from the browser using
 * user OAuth tokens, bypassing the need for server-side functions or local bridges.
 */

export async function executeGWSClientAction(toolId: string, action: string, params: any, accessToken: string) {
  console.log(`[GWSClient] Executing ${toolId}:${action}`, params);

  switch (toolId) {
    case 'workspace_gmail':
      return handleGmailAction(action, params, accessToken);
    case 'workspace_calendar':
      return handleCalendarAction(action, params, accessToken);
    default:
      throw new Error(`Client-side tool ${toolId} not implemented yet.`);
  }
}

async function handleGmailAction(action: string, params: any, token: string) {
  if (action === '+triage' || action === 'listMessages') {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    // Fetch snippets for triage
    const messages = await Promise.all((data.messages || []).map(async (m: any) => {
      const detail = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=minimal`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json());
      return { id: m.id, snippet: detail.snippet };
    }));

    return { status: "success", type: "gmail_triage", messages };
  }
  return { status: "error", message: `Gmail action ${action} not supported in stateless mode.` };
}

async function handleCalendarAction(action: string, params: any, token: string) {
  if (action === '+agenda' || action === 'listEvents') {
    const now = new Date().toISOString();
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10&singleEvents=true&orderBy=startTime`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const events = (data.items || []).map((e: any) => ({
      summary: e.summary,
      start: e.start.dateTime || e.start.date,
      location: e.location
    }));

    return { status: "success", type: "calendar_agenda", events };
  }
  return { status: "error", message: `Calendar action ${action} not supported in stateless mode.` };
}
