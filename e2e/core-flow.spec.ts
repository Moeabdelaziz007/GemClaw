import { test, expect } from '@playwright/test';
import { mockVoiceAPI, mockMediaDevices } from './utils/voice-mock';

test.describe('AetherOS Golden Path', () => {
  test.beforeEach(async ({ page }) => {
    await mockVoiceAPI(page);
    await mockMediaDevices(page);
  });

  test('Voice -> Materialize -> Workspace flow', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/Gemclaw/i);
    await expect(page.getByTestId('launch-terminal-button')).toBeVisible();

    // 2. Move to Forge deterministic route
    await page.goto('/forge');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('forge-conversational-root')).toBeVisible();

    // 3. Verify voice controls are visible and responsive
    const micToggle = page.getByTestId('forge-mic-toggle');
    await expect(micToggle).toBeVisible();
    await micToggle.click();
    await expect(page.getByText(/NEURAL IMPRINT DETECTED/i)).toBeVisible();
  });
});
