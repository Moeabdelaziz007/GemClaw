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
    command: 'NEXT_PUBLIC_FIREBASE_API_KEY=dummy NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy NEXT_PUBLIC_FIREBASE_APP_ID=dummy npm run build && NEXT_PUBLIC_FIREBASE_API_KEY=dummy NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dummy NEXT_PUBLIC_FIREBASE_PROJECT_ID=dummy NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dummy NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dummy NEXT_PUBLIC_FIREBASE_APP_ID=dummy npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
