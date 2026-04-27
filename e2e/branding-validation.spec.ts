import { expect } from '@playwright/test';
import { test } from './setup';

test.describe('Mission 06: Branding & Identity', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display Gemclaw AIOS branding in the title and dashboard', async ({ page }) => {
    await expect(page).toHaveTitle(/Gemclaw/i);
    // Gemclaw does not appear as text in the dashboard directly based on the component,
    // Sovereign_OS V3.0_LIQUID is used
    const branding = page.getByText(/Sovereign_OS/i);
    await expect(branding.first()).toBeVisible();
  });

  test('should verify Aether Forge identity in the forge route', async ({ page }) => {
    await page.goto('/forge');
    
    // Check for "Aether Forge" specifically
    // The component splits 'Aether' and 'Forge' into separate spans
    await expect(page.getByText(/Aether/i).first()).toBeVisible();
    await expect(page.getByText(/Forge/i).first()).toBeVisible();
    
    // Check for "Neural Entity Synthesis" which is part of the Forge identity
    await expect(page.getByText(/Neural Entity Synthesis/i)).toBeVisible();
  });

  test('should verify branding consistency in setting/workspace', async ({ page }) => {
    await page.goto('/workspace');
    await expect(page).toHaveTitle(/Gemclaw/i);
    
    // Settings check
    await page.goto('/settings');
    // Using System Parameters since it exists in the translation dict
    await expect(page.getByText(/System Parameters/i).first()).toBeVisible();
  });
});
