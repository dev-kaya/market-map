import { test, expect } from '@playwright/test';

test.describe('Authentication Gating', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth cookies
    await page.context().clearCookies();
  });

  test('should show limited companies and signup CTA for anonymous users', async ({ page }) => {
    await page.goto('/');
    
    // Wait for companies to load
    await page.waitForSelector('[data-testid="company-card"]', { timeout: 10000 });
    
    // Should show exactly 4 companies (first row)
    const companyCards = await page.locator('[data-testid="company-card"]').count();
    expect(companyCards).toBeLessThanOrEqual(4);
    
    // Should show gating overlay
    await expect(page.locator('text=Unlock the complete CEE startup map')).toBeVisible();
    
    // Should show both auth buttons
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("Send me a magic link")')).toBeVisible();
    
    // Should show total count in CTA
    await expect(page.locator('text=Discover')).toBeVisible();
  });

  test('should redirect to signup and back after Google sign-in', async ({ page }) => {
    await page.goto('/');
    
    // Wait for gating overlay
    await expect(page.locator('text=Unlock the complete CEE startup map')).toBeVisible();
    
    // Click Google sign-in
    await page.click('button:has-text("Continue with Google")');
    
    // Should navigate to signup page
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator('h1:has-text("Unlock the complete CEE startup map")')).toBeVisible();
    
    // Click Google sign-in on signup page (this will mock authentication)
    await page.click('button:has-text("Continue with Google")');
    
    // Should redirect back to homepage
    await expect(page).toHaveURL('/');
    
    // Wait a bit for auth to process
    await page.waitForTimeout(2000);
    
    // Reload to ensure auth state is persisted
    await page.reload();
    await page.waitForSelector('[data-testid="company-card"]', { timeout: 10000 });
    
    // Should show more companies now (authenticated)
    const companyCardsAfterAuth = await page.locator('[data-testid="company-card"]').count();
    expect(companyCardsAfterAuth).toBeGreaterThan(4);
    
    // Gating overlay should be gone
    await expect(page.locator('text=Unlock the complete CEE startup map')).not.toBeVisible();
  });

  test('should handle magic link signup flow', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill email and submit magic link form
    await page.fill('input[type="email"]', 'user@example.com');
    await page.click('button:has-text("Send me a magic link")');
    
    // Should show email sent confirmation
    await expect(page.locator('text=Check your email')).toBeVisible();
    await expect(page.locator('text=user@example.com')).toBeVisible();
    
    // Can try different email
    await page.click('button:has-text("Try a different email")');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should preserve callback URL through signup flow', async ({ page }) => {
    const testUrl = '/?view=sectors&search=test';
    await page.goto(testUrl);
    
    // Click signup from gated content
    await page.click('button:has-text("Continue with Google")');
    
    // Should include callback URL in signup
    expect(page.url()).toContain('callbackUrl=');
    expect(page.url()).toContain(encodeURIComponent(testUrl));
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="company-card"]', { timeout: 10000 });
    
    // Should show limited companies on mobile too
    const companyCards = await page.locator('[data-testid="company-card"]').count();
    expect(companyCards).toBeLessThanOrEqual(4);
    
    // Gating overlay should be visible and properly sized
    await expect(page.locator('text=Unlock the complete CEE startup map')).toBeVisible();
    
    // Buttons should be full width and accessible
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();
    
    const buttonWidth = await googleButton.evaluate(el => el.getBoundingClientRect().width);
    expect(buttonWidth).toBeGreaterThan(200); // Should be reasonably wide
  });
});