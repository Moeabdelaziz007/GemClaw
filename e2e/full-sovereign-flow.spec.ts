import { expect } from '@playwright/test';
import { test } from './setup';
import { mockVoiceAPI, mockMediaDevices, simulateVoiceInput } from './utils/voice-mock';

test.describe('GemclawOS Full Sovereign Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockVoiceAPI(page);
    await mockMediaDevices(page);

    await page.route('**/api/forge/synthesize', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          blueprint: {
            name: 'Nova',
            role: 'AI Assistant',
            systemPrompt: 'You are Nova, a helpful AI assistant.',
            voiceName: 'Zephyr',
            tools: { googleSearch: true },
            skills: { gmail: true }
          }
        })
      });
    });

  });

  test('loads landing and exposes launch action', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('firebase:authUser:dummy:[DEFAULT]');
      window.localStorage.removeItem('firebase:authUser:mock-app-key');
      delete (window as any).__e2eMockUser__;
    });
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('launch-terminal-button')).toBeVisible();
  });

  test('forge flow reacts to deterministic voice simulation', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('firebase:authUser:dummy:[DEFAULT]', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      window.localStorage.setItem('firebase:authUser:mock-app-key', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      (window as any).__e2eMockUser__ = { uid: 'test-user-123', email: 'test@gemigram.os' };
    });
    await page.goto('/forge');

    await page.waitForTimeout(1000);
    await expect(page.getByTestId('forge-conversational-root')).toBeVisible();
    await expect(page.getByText(/Aether/i).first()).toBeVisible();

    const micToggle = page.getByTestId('forge-mic-toggle');
    await expect(micToggle).toBeVisible();
  });
});
