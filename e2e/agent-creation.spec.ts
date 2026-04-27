import { expect } from '@playwright/test';
import { test } from './setup';

test('navigate to hub and verify materialization button', async ({ page }) => {
  await page.goto('/hub');
  await page.waitForLoadState('networkidle');

  // Verify button exists and is interactive
  const materializeBtn = page.getByText(/Materialize_Entity/i).first();
  await expect(materializeBtn).toBeVisible();

  await materializeBtn.click();
  await expect(page).toHaveURL(/.*\/forge/);
});
