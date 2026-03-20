import { test, expect } from '@playwright/test';

/**
 * 🧪 Mission 06: Branding Validation
 * Verifies that the Gemigram AIOS branding and Aether Forge identity 
 * are correctly applied across the system.
 */
test.describe('Mission 06: Branding & Identity', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the root/dashboard
    await page.goto('/dashboard');
  });

  test('should display Gemigram AIOS branding in the title and dashboard', async ({ page }) => {
    // Title check
    await expect(page).toHaveTitle(/Gemigram/i);
    
    // Header/Logo check (if applicable)
    // Looking for Gemigram text in the UI
    const branding = page.getByText(/Gemigram/i);
    await expect(branding.first()).toBeVisible();
  });

  test('should verify Aether Forge identity in the forge route', async ({ page }) => {
    await page.goto('/forge');
    
    // Check for "Aether Forge" specifically
    await expect(page.getByText(/Aether Forge/i)).toBeVisible();
    
    // Check for "Synthesis Chamber" which is part of the Forge identity
    await expect(page.getByText(/SYNTHESIS CHAMBER/i)).toBeVisible();
  });

  test('should verify branding consistency in setting/workspace', async ({ page }) => {
    // Workspace check
    await page.goto('/workspace');
    await expect(page).toHaveTitle(/Gemigram/i);
    
    // Settings check
    await page.goto('/settings');
    await expect(page.getByText(/SYSTEM_PARAMETERS/i)).toBeVisible();
  });
});
