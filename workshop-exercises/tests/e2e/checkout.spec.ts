import { expect, test, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Password').fill('workshop-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/store');
}

function parseDollars(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

test.describe('Store checkout flow', () => {
  test('user can log in and see the store', async ({ page }) => {
    // Act
    await login(page);

    // Assert
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByTestId('add-prod_1')).toBeVisible();
  });

  test('user can add an item to the cart', async ({ page }) => {
    // Arrange
    await login(page);

    // Act
    await page.getByTestId('add-prod_1').click();

    // Assert
    await expect(page.getByTestId('cart-items')).toContainText('Workshop T-Shirt');
  });

  test('user can apply a discount code', async ({ page }) => {
    // Arrange — login, add an item, and read the subtotal before any discount
    await login(page);
    await page.getByTestId('add-prod_1').click();
    await expect(page.getByTestId('cart-items')).toContainText('Workshop T-Shirt');
    const before = parseDollars(await page.getByTestId('checkout-total').innerText());

    // Act
    await page.getByPlaceholder('e.g. SAVE10').fill('SAVE10');
    await page.getByRole('button', { name: 'Apply' }).click();

    // Assert — SAVE10 takes exactly 10% off, regardless of how much was in the cart
    await expect(page.getByText(/applied/i)).toBeVisible();
    const after = parseDollars(await page.getByTestId('checkout-total').innerText());
    expect(after).toBeCloseTo(Math.round(before * 0.9 * 100) / 100, 2);
  });

  test('user completes checkout and sees confirmation', async ({ page }) => {
    // Arrange
    await login(page);
    await page.getByTestId('add-prod_1').click();
    await expect(page.getByTestId('cart-items')).toContainText('Workshop T-Shirt');

    // Act
    await page.getByTestId('pay-btn').click();

    // Assert
    await expect(page.getByRole('heading', { name: 'Order confirmed!' })).toBeVisible();
    await expect(page.getByTestId('payment-id')).toBeVisible();
    await expect(page.getByTestId('continue-shopping-btn')).toBeVisible();
  });
});
