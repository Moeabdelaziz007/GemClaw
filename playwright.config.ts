import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: 'mock-app-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'mock-app-key.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'mock-app-key',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'mock-app-key.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:1234567890:web:1234567890',
    },
  },
});
