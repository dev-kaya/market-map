import { test, expect } from '@playwright/test';

test.describe('Suggest Startup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow suggesting a startup and show in admin', async ({ page }) => {
    // Click suggest button in header
    await page.click('button:has-text("Suggest Startup")');
    
    // Fill in modal
    await page.fill('input[placeholder*="JetBrains"]', 'E2E Test Company');
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Thanks for your suggestion!')).toBeVisible();
    
    // Wait for modal to close
    await page.waitForTimeout(2500);
    
    // Navigate to admin (in real app this would require auth)
    await page.goto('/admin/suggestions');
    
    // Check that suggestion appears
    await expect(page.locator('text=E2E Test Company')).toBeVisible();
    
    // Test "Add to Draft" functionality
    await page.click('button:has-text("Add to Draft")');
    
    // Should navigate to new company form with pre-filled name
    await expect(page).toHaveURL(/\/admin\/new\?name=E2E%20Test%20Company/);
    await expect(page.locator('input[value="E2E Test Company"]')).toBeVisible();
  });

  test('should show error for duplicate suggestions', async ({ page }) => {
    // Submit first suggestion
    await page.click('button:has-text("Suggest Startup")');
    await page.fill('input[placeholder*="JetBrains"]', 'Duplicate Company');
    await page.click('button[type="submit"]');
    
    // Wait for success and modal close
    await expect(page.locator('text=Thanks for your suggestion!')).toBeVisible();
    await page.waitForTimeout(2500);
    
    // Try to submit the same suggestion again
    await page.click('button:has-text("Suggest Startup")');
    await page.fill('input[placeholder*="JetBrains"]', 'Duplicate Company');
    await page.click('button[type="submit"]');
    
    // Should show duplicate error
    await expect(page.locator('text=This startup has already been suggested')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('button:has-text("Suggest Startup")');
    
    // Try submitting empty form
    await page.click('button[type="submit"]');
    // Button should be disabled for empty input
    await expect(page.locator('button[type="submit"][disabled]')).toBeVisible();
    
    // Try submitting too short name
    await page.fill('input[placeholder*="JetBrains"]', 'A');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=at least 2 characters')).toBeVisible();
  });

  test('should show suggest button in empty state', async ({ page }) => {
    // Search for something that doesn't exist
    await page.fill('input[placeholder="Search companies..."]', 'NonexistentCompany123');
    
    // Should show empty state with suggest button
    await expect(page.locator('text=No companies found')).toBeVisible();
    await expect(page.locator('text=Suggest a startup')).toBeVisible();
    
    // Click the empty state suggest button
    await page.click('button:has-text("Suggest Startup")');
    
    // Modal should open
    await expect(page.locator('text=Suggest a Startup')).toBeVisible();
  });
});