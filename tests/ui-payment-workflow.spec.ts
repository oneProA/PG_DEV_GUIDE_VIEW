import { test, expect } from '@playwright/test';

test('Home hero highlights CJ PG and navigates to the Payment doc', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'CJ PG Developer Center' })).toBeVisible();
  await expect(page.getByText('Next Generation Payments')).toBeVisible();
  const headerNav = page.getByRole('navigation').first();
  const apiLink = headerNav.getByRole('link', { name: 'API' });
  await expect(apiLink).toBeVisible();

  await apiLink.click();
  await expect(page).toHaveURL(/\/api\/payment$/);
  await expect(page.getByText('Payment API')).toBeVisible();
  await expect(page.locator('text=Response JSON')).toBeVisible();
});

test('Payment documentation lists required params and a sample payload', async ({ page }) => {
  await page.goto('/api/payment');

  await expect(page.getByRole('cell', { name: 'mid' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'orderId' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'amount' })).toBeVisible();
  await expect(page.locator('pre').filter({ hasText: 'paymentKey' })).toBeVisible();
  await expect(page.getByText('Response JSON')).toBeVisible();
});

test('Playground panels show the canned request and response summaries', async ({ page }) => {
  await page.goto('/playground');

  await expect(page.getByRole('heading', { name: 'API Playground' })).toBeVisible();
  const requestBody = page.locator('textarea');
  await expect(requestBody).toContainText('CJ_20241027_0001');
  await expect(page.getByText('Response Headers')).toBeVisible();
  await expect(page.getByText('Response Body')).toBeVisible();
  await expect(page.locator('text=transaction_id')).toBeVisible();
});
