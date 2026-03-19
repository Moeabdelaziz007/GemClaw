import { NextResponse } from 'next/server';

/**
 * 🛡️ Sovereign GitHub OAuth Bridge
 * Securely exchanges authorization codes for tokens without exposing Client Secrets to the browser.
 */
export async function POST(req: Request) {
  try {
    const { code, state, redirectUri } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const clientId = process.env.GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('[GitHub Bridge] Missing Server-Side Credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        state
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GitHub Bridge] Exchange Failed:', errorText);
      return NextResponse.json({ error: 'Failed to exchange token with GitHub' }, { status: response.status });
    }

    const data = await response.json();
    
    // Return the token to the client. 
    // NOTE: Ideally, we should set this in a secure cookie or handle it via NextAuth,
    // but for now, we are just proxying to remove the secret exposure.
    return NextResponse.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    });

  } catch (error) {
    console.error('[GitHub Bridge] Fatal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
