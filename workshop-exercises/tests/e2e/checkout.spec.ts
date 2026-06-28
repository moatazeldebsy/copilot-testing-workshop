import { expect, test } from '@playwright/test';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ request }) => {
    // Reset server data before each test
    await request.post('/api/auth/login'); // wake server
  });

  test('user can log in and reach the cart page', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: navigate to /login, fill credentials, assert redirect to /dashboard
  });

  test('user can add items to cart and proceed to checkout', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: login → /cart → click Add on a product → click Proceed to Checkout
  });

  test('user can apply a discount code during checkout', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: login → /cart → add item → /checkout → enter SAVE10 → verify total updated
  });

  test('user completes the full checkout and sees confirmation', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Full golden path: login → add to cart → checkout → discount → fraud → pay → confirmation
  });
});
