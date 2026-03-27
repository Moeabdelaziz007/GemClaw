import { test, expect } from '@playwright/test';
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

    // Navigate to landing
    await page.goto('/');
  });

  test('loads landing and exposes launch action', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('launch-terminal-button')).toBeVisible();
  });

  test('forge flow reacts to deterministic voice simulation', async ({ page }) => {
    await page.goto('/forge');

    await expect(page.getByTestId('forge-conversational-root')).toBeVisible();
    await expect(page.getByText(/Aether/i)).toBeVisible();

    await simulateVoiceInput(page, "Create a helpful assistant named Nova");

    const micToggle = page.getByTestId('forge-mic-toggle');
    await expect(micToggle).toBeVisible();
    await micToggle.click();

    await expect(page.getByTestId('forge-thinking-indicator')).toBeVisible({ timeout: 10000 });
  });
});
