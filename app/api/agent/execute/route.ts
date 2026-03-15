import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  // In a real app, this would call the Firebase Cloud Function
  // For now, we'll mock it or call it directly if possible.
  // Since we are in the same project, we can call the function directly
  // or via HTTP. Let's assume we call it via HTTP.
  
  const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL;
  
  if (!FIREBASE_FUNCTION_URL) {
    return NextResponse.json({ error: "Firebase Function URL not configured" }, { status: 500 });
  }

  const response = await fetch(FIREBASE_FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return NextResponse.json(data);
}
