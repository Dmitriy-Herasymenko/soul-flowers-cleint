import { test, expect } from '@playwright/test';

test.describe('Products Pages', () => {
  test('should load products page with categories and products', async ({ page }) => {
    await page.goto('http://localhost:3000/products', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check page title
    await expect(page).toHaveTitle(/Каталог квітів|Elisia/);

    // Check header
    await expect(page.getByRole('heading', { name: 'Каталог квітів' })).toBeVisible({ timeout: 10000 });

    // Check products grid is visible
    await expect(page.locator('[href^="/products/"]').filter({ hasText: '₴' }).first()).toBeVisible({ timeout: 10000 });

    // Check pagination is visible
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();
  });

  test('should navigate to category page when clicking on category', async ({ page }) => {
    await page.goto('http://localhost:3000/products', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Click on Троянди category in sidebar
    await page.locator('aside a[href*="/products/category/troiandy"]').first().click();
    await page.waitForURL(/\/products\/category\/troiandy/);

    // Check category page loaded
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Check products are visible
    await expect(page.locator('[href^="/products/"]').filter({ hasText: '₴' }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should load product detail page', async ({ page }) => {
    await page.goto('http://localhost:3000/products/buket-chervonykh-troiand', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check product page loaded
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });

    // Check price is visible
    await expect(page.getByText('₴').first()).toBeVisible();

    // Check JSON-LD structured data is present
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('"@type":"Product"');
  });

  test('should have proper SEO metadata on product page', async ({ page }) => {
    await page.goto('http://localhost:3000/products/buket-chervonykh-troiand', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check meta description exists
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();

    // Check OpenGraph tags exist
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
  });

  test('should handle pagination on products page', async ({ page }) => {
    await page.goto('http://localhost:3000/products?page=1', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check pagination is visible
    await expect(page.getByRole('navigation', { name: 'Pagination' })).toBeVisible();

    // Check "Вперед" (next) link exists
    await expect(page.getByRole('link', { name: 'Вперед' })).toBeVisible();
  });

  test('should show categories section on products page', async ({ page }) => {
    await page.goto('http://localhost:3000/products', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);

    // Check categories section exists in sidebar
    await expect(page.locator('aside h2').first()).toBeVisible();
    await expect(page.locator('aside a[href*="/products/category/troiandy"]').first()).toBeVisible();
  });
});
