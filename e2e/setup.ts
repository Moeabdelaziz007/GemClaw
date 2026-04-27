import { test as base } from '@playwright/test';

// Add any test setup here
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      // Setup mock auth token
      window.localStorage.setItem('firebase:authUser:dummy:[DEFAULT]', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      window.localStorage.setItem('firebase:authUser:mock-app-key', JSON.stringify({ uid: 'test-user-123', email: 'test@gemigram.os' }));
      (window as any).__e2eMockUser__ = { uid: 'test-user-123', email: 'test@gemigram.os' };
    });

    // Attempt to override the Firebase fetch mechanism to fulfill token lookup
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

    await use(page);
  },
});
export { expect } from '@playwright/test';
