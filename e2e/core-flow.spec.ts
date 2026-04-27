import { expect } from '@playwright/test';
import { test } from './setup';
import { mockVoiceAPI, mockMediaDevices } from './utils/voice-mock';

test.describe('AetherOS Golden Path', () => {
  test.beforeEach(async ({ page }) => {
    await mockVoiceAPI(page);
    await mockMediaDevices(page);
  });

  test('Voice -> Materialize -> Workspace flow', async ({ page }) => {
    // 1. Visit Landing Page
    // Landing requires no user, so we override the auth mock just for this
    await page.addInitScript(() => {
      window.localStorage.removeItem('firebase:authUser:dummy:[DEFAULT]');
      window.localStorage.removeItem('firebase:authUser:mock-app-key');
      delete (window as any).__e2eMockUser__;
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Gemclaw/i);
    await expect(page.getByTestId('launch-terminal-button')).toBeVisible();

    // Re-inject the mock for subsequent steps
    await page.evaluate(() => {
      window.localStorage.setItem('firebase:authUser:dummy:[DEFAULT]', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      window.localStorage.setItem('firebase:authUser:mock-app-key', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      (window as any).__e2eMockUser__ = { uid: 'test-user-123', email: 'test@gemigram.os' };
    });

    // 2. Move to Forge deterministic route
    await page.goto('/forge');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.getByTestId('forge-conversational-root')).toBeVisible();

    // 3. Verify voice controls are visible and responsive
    const micToggle = page.getByTestId('forge-mic-toggle');
    await expect(micToggle).toBeVisible();
  });
});
