import { CartRepository } from '../../src/repositories/cartRepository';
import { CartService } from '../../src/services/cartService';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    const repo = new CartRepository();
    cartService = new CartService(repo);
  });

  it('returns an empty cart for a new user', async () => {
    // TODO: use Copilot to generate this test
  });

  it('adds an item to the cart', async () => {
    // TODO: use Copilot to generate this test
  });

  it('increases quantity when the same product is added again', async () => {
    // TODO: use Copilot to generate this test
  });

  it('removes an item from the cart', async () => {
    // TODO: use Copilot to generate this test
  });

  it('throws ITEM_NOT_FOUND when removing a non-existent item', async () => {
    // TODO: use Copilot to generate this test
  });

  it('calculates the correct subtotal', async () => {
    // TODO: use Copilot to generate this test
  });
});
