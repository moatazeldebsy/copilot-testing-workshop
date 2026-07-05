import { expect, test } from '@playwright/test';

test.describe('Store checkout flow', () => {
  test.fixme('user can log in and see the store', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: navigate to /login, fill credentials, assert redirect to /store
  });

  test.fixme('user can add an item to the cart', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: login → click Add on a product → assert cart-items list updates
  });

  test.fixme('user can apply a discount code', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Hint: login → add item → enter SAVE10 in promo field → apply → verify total reduced
  });

  test.fixme('user completes checkout and sees confirmation', async ({ page }) => {
    // TODO: use Copilot to generate this test
    // Full golden path: login → add to cart → pay → confirmation screen
  });
});
