import { test, expect } from '@playwright/test';

test('Full Forge navigation workflow without crashing', async ({ page }) => {
  await page.goto('/hub');
  await page.waitForLoadState('networkidle');

  // if user is redirected to /, skip
  if(page.url().includes('/hub')) {
     const createButton = page.getByRole('button', { name: /Materialize_Entity/i }).first();
     if (await createButton.isVisible()) {
        await createButton.click();
        await expect(page).toHaveURL(/.*\/forge/, { timeout: 10000 });
     }
  }

  // navigate to galaxy
  await page.goto('/galaxy');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
});
