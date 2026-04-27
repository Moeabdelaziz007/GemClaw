import { expect } from '@playwright/test';
import { test } from './setup';

test('auth redirect checks and structure', async ({ page }) => {
  await page.route('**/identitytoolkit.googleapis.com/v1/accounts:lookup*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        users: [{
          localId: 'test-user-123',
          email: 'test@gemigram.os',
          emailVerified: true
        }]
      })
    });
  });

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Assert we are actually on dashboard and not redirected to login
  await expect(page).toHaveURL(/.*\/dashboard/);
  // It uses Sovereign_OS instead of h1
  await expect(page.getByText(/Sovereign_OS/i).first()).toBeVisible();
});
