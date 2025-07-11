import { test, expect } from '@playwright/test';

test.describe('Market Map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Market Map');
  });

  test('should display search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('OpenAI');
    await expect(page.locator('text=OpenAI')).toBeVisible();
  });

  test('should display filters', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filters")');
    await expect(filterButton).toBeVisible();
    
    await filterButton.click();
    await expect(page.locator('text=Stage')).toBeVisible();
    await expect(page.locator('text=Geography')).toBeVisible();
    await expect(page.locator('text=Category')).toBeVisible();
  });

  test('should toggle between grid and list view', async ({ page }) => {
    const gridButton = page.locator('button').first();
    const listButton = page.locator('button').nth(1);
    
    await listButton.click();
    await expect(page.locator('.market-map-grid')).not.toBeVisible();
    
    await gridButton.click();
    await expect(page.locator('.market-map-grid')).toBeVisible();
  });

  test('should filter by stage', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filters")');
    await filterButton.click();
    
    const seedBadge = page.locator('text=Seed').first();
    await seedBadge.click();
    
    await expect(page.locator('text=Showing')).toBeVisible();
  });

  test('should display company cards with key information', async ({ page }) => {
    const companyCard = page.locator('.company-card').first();
    await expect(companyCard).toBeVisible();
    
    await expect(companyCard.locator('h3')).toBeVisible();
    await expect(companyCard.locator('text=$')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator('button:has-text("Filters")')).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('NonExistentCompany123');
    
    await expect(page.locator('text=Showing 0 of')).toBeVisible();
  });

  test('should display zoom controls', async ({ page }) => {
    const zoomIn = page.locator('button:has-text("+")');
    const zoomOut = page.locator('button:has-text("-")');
    
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.focus();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button:has-text("Filters")')).toBeFocused();
  });
});