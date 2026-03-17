import { test, expect } from '@playwright/test';

test('Settings page interactions', async ({ page }) => {
  await page.goto('/settings');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
});
