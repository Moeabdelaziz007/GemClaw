import { test, expect } from '@playwright/test';

test('navigate to hub and try to open forge', async ({ page }) => {
  await page.goto('/hub');
  await expect(page).toHaveURL(/.*\/hub/);
  // Simulate clicking the create button to go to forge
<<<<<<< HEAD
  const createButton = page.locator('text=Create New Agent').first();
  if (await createButton.isVisible()) {
      await createButton.click();
      await expect(page).toHaveURL(/.*\/forge/);
  }
=======
  const createButton = page.locator('text=Create Entity').first();
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page).toHaveURL(/.*\/forge/);
>>>>>>> origin/ci-cd-e2e-testing-14768196244551202311
});
