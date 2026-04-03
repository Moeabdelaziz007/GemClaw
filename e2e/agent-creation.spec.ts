import { test, expect } from '@playwright/test';

test('navigate to hub and verify materialization button', async ({ page }) => {
  // Mock auth state for the test
  await page.addInitScript(() => {
    window.localStorage.setItem('firebase:authUser:mock-app-key', JSON.stringify({ uid: 'test-user' }));
  });

  await page.goto('/hub');
  await page.waitForLoadState('networkidle');

  // Verify 'Materialize_Entity' button exists and is interactive
  const materializeBtn = page.getByRole('button', { name: /Materialize_Entity/i }).first();
  await expect(materializeBtn).toBeVisible({ timeout: 10000 });
  await expect(materializeBtn).toBeEnabled();

  // Test navigation to forge
  await materializeBtn.click();
  await expect(page).toHaveURL(/.*\/forge/, { timeout: 10000 });
});
