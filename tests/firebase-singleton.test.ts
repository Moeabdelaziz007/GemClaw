import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApps } from 'firebase/app';

describe('Firebase singleton bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'gemclaw-single-project';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456:web:abcdef';
  });

  it('initializes once and keeps a single firebase app bound to one project', async () => {
    const first = await import('../firebase');
    const second = await import('../firebase');

    expect(first.app).toBe(second.app);
    expect(getApps().length).toBe(1);
    expect(first.app.options.projectId).toBe('gemclaw-single-project');
  });
});
