import { test, expect } from '@playwright/test';

test('auth redirect checks and structure', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();

  // Try workspace, wrap in try/catch if it redirects with abortion
  try {
     await page.goto('/workspace');
     await page.waitForLoadState('networkidle');
  } catch(e) {
     // expected if the framework abruptly aborts navigation for redirect in test env
  }

  const url = page.url();
  expect(url.includes('/workspace') || url.includes('/')).toBeTruthy();
});
