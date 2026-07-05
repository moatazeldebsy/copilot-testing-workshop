/**
 * BONUS — CartService unit tests (not a timed exercise)
 *
 * The full pipeline is covered at the API level in Exercise C (checkout.test.ts).
 * Use this file if you finish Exercise A/B early or want extra Copilot practice.
 */

import { ApiError } from '../../src/errors/apiError';
import { CartRepository } from '../../src/repositories/cartRepository';
import { CartService } from '../../src/services/cartService';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    const repo = new CartRepository();
    cartService = new CartService(repo);
  });

  it('returns an empty cart for a new user', async () => {
    // Act
    const cart = await cartService.getCart('user-1');

    // Assert
    expect(cart.items).toEqual([]);
    expect(cart.subtotal).toBe(0);
  });

  it('adds an item to the cart', async () => {
    // Act
    const cart = await cartService.addItem('user-1', {
      productId: 'prod_1',
      name: 'Workshop T-Shirt',
      price: 25,
      quantity: 2,
    });

    // Assert
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe('prod_1');
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.subtotal).toBe(50);
  });

  it('increases quantity when the same product is added again', async () => {
    // Arrange
    await cartService.addItem('user-1', { productId: 'prod_1', name: 'Workshop T-Shirt', price: 25, quantity: 1 });

    // Act
    const cart = await cartService.addItem('user-1', { productId: 'prod_1', name: 'Workshop T-Shirt', price: 25, quantity: 1 });

    // Assert — merged into the same line item, not duplicated
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  it('removes an item from the cart', async () => {
    // Arrange
    const added = await cartService.addItem('user-1', { productId: 'prod_1', name: 'Workshop T-Shirt', price: 25, quantity: 1 });
    const itemId = added.items[0].id;

    // Act
    const cart = await cartService.removeItem('user-1', itemId);

    // Assert
    expect(cart.items).toEqual([]);
    expect(cart.subtotal).toBe(0);
  });

  it('throws ITEM_NOT_FOUND when removing a non-existent item', async () => {
    expect.assertions(2);

    try {
      await cartService.removeItem('user-1', 'does-not-exist');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('ITEM_NOT_FOUND');
    }
  });

  it('calculates the correct subtotal', async () => {
    // Arrange & Act
    await cartService.addItem('user-1', { productId: 'prod_1', name: 'Workshop T-Shirt', price: 25, quantity: 2 });
    const cart = await cartService.addItem('user-1', { productId: 'prod_2', name: 'Dev Mug', price: 18, quantity: 1 });

    // Assert — (25 * 2) + (18 * 1)
    expect(cart.subtotal).toBe(68);
  });
});
