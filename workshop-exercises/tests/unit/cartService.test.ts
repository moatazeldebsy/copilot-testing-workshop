/**
 * BONUS — CartService unit tests (not a timed exercise)
 *
 * The full pipeline is covered at the API level in Exercise C (checkout.test.ts).
 * Use this file if you finish Exercise A/B early or want extra Copilot practice.
 */

import { CartRepository } from '../../src/repositories/cartRepository';
import { CartService } from '../../src/services/cartService';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    const repo = new CartRepository();
    cartService = new CartService(repo);
  });

  // TODO: use Copilot to generate this test
  it.todo('returns an empty cart for a new user');

  // TODO: use Copilot to generate this test
  it.todo('adds an item to the cart');

  // TODO: use Copilot to generate this test
  it.todo('increases quantity when the same product is added again');

  // TODO: use Copilot to generate this test
  it.todo('removes an item from the cart');

  // TODO: use Copilot to generate this test
  it.todo('throws ITEM_NOT_FOUND when removing a non-existent item');

  // TODO: use Copilot to generate this test
  it.todo('calculates the correct subtotal');
});
