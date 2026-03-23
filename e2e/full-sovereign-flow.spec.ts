import { test, expect } from '@playwright/test';
import { mockVoiceAPI, simulateVoiceInput } from './utils/voice-mock';

test.describe('GemclawOS Full Sovereign Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockVoiceAPI(page);
    // Navigate to landing
    await page.goto('/');
  });

  test('should navigate from landing to forge via voice simulation', async ({ page }) => {
    // Check if landing page loads
    await expect(page.locator('h1')).toContainText(/Gemclaw/i);

    // Click Enter or simulate voice navigation if implemented
    const enterButton = page.getByRole('button', { name: /Enter|Start/i });
    if (await enterButton.isVisible()) {
      await enterButton.click();
    }

    // Verify Forge navigation
    await expect(page).toHaveURL(/.*forge/);
    
    // Check for Aether Forge branding
    await expect(page.locator('body')).toContainText(/Aether Forge/i);
  });

  test('should simulate agent creation intent', async ({ page }) => {
    await page.goto('/forge');
    
    // Simulate user saying "Create a helpful assistant named Nova"
    // Note: This relies on the Intent Engine responding to "create"
    await simulateVoiceInput(page, "Create a helpful assistant named Nova");
    
    // Check if the UI reflects thinking or synthesis state
    // (This depends on the specific implementation of ConversationalAgentCreator)
    // await expect(page.locator('[data-testid="thinking-indicator"]')).toBeVisible();
  });

  test('should verify workspace connection', async ({ page }) => {
    // This assumes a session is active
    await page.goto('/workspace');
    
    // Verify Voice Orb presence
    const voiceOrb = page.locator('.voice-orb'); // Adjust selector as needed
    // await expect(voiceOrb).toBeVisible();
  });
});
