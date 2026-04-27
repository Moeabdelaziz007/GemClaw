import { expect } from '@playwright/test';
import { test } from './setup';
import { mockVoiceAPI, mockMediaDevices } from './utils/voice-mock';

test('navigate to forge and render correctly', async ({ page }) => {
  await mockVoiceAPI(page);
  await mockMediaDevices(page);
  await page.goto('/forge');

  await expect(page).toHaveURL(/.*\/forge/);
  await page.waitForTimeout(1000);
  await expect(page.getByTestId('forge-conversational-root')).toBeVisible();
  await expect(page.getByTestId('forge-mic-toggle')).toBeVisible();
});
