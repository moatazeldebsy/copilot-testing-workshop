/**
 * Integration demo solution — service-layer pipeline.
 * This file lives alongside checkout.pipeline.test.ts (which has empty
 * it.todo stubs). Participants fill in checkout.pipeline.test.ts; this file
 * is the reference answer available on the 07-service-integration branch.
 *
 * Contrast with tests/api/checkout.solution.test.ts: same pipeline, but here
 * we call the exported service singletons directly instead of driving HTTP
 * through Supertest.
 */

import {
  resetWorkshopData,
  cartService,
  discountService,
  fraudService,
  paymentService,
  notificationService,
  userService,
} from '../../src/app';

describe('checkout pipeline (integration solution)', () => {
  let userId: string;

  beforeEach(async () => {
    await resetWorkshopData();
    const { user } = await userService.authenticate('alice@example.com', 'workshop-password');
    userId = user.id;
  });

  it('adds an item via cartService and reflects it in the cart total', async () => {
    const cart = await cartService.addItem(userId, {
      productId: 'prod_1',
      name: 'Workshop T-Shirt',
      price: 25,
      quantity: 2,
    });

    expect(cart.items).toHaveLength(1);
    expect(cart.subtotal).toBe(50);
  });

  it('applies a discount via discountService on top of the cart subtotal', async () => {
    const cart = await cartService.addItem(userId, {
      productId: 'prod_1',
      name: 'Workshop T-Shirt',
      price: 100,
      quantity: 1,
    });

    const result = discountService.apply('SAVE10', cart.subtotal);

    expect(result.discountAmount).toBe(10);
    expect(result.finalTotal).toBe(90);
  });

  it('approves a low-risk order via fraudService for the same cart', async () => {
    const cart = await cartService.addItem(userId, {
      productId: 'prod_1',
      name: 'Workshop T-Shirt',
      price: 25,
      quantity: 1,
    });

    const result = fraudService.check({
      userId,
      orderAmount: cart.subtotal,
      itemCount: cart.items.length,
      ipCountry: 'DE',
    });

    expect(result.approved).toBe(true);
    expect(result.riskLevel).toBe('low');
  });

  it('charges, captures, and refunds a payment via paymentService', () => {
    const intent = paymentService.charge({ userId, amount: 25 });
    expect(intent.status).toBe('pending');

    const captured = paymentService.capture(intent.id);
    expect(captured.status).toBe('captured');

    const refunded = paymentService.refund(intent.id);
    expect(refunded.status).toBe('refunded');
  });

  it('sends and retrieves a receipt via notificationService after payment', () => {
    const intent = paymentService.charge({ userId, amount: 25 });
    paymentService.capture(intent.id);

    notificationService.send({
      userId,
      type: 'receipt',
      email: 'alice@example.com',
      subject: `Receipt for ${intent.id}`,
    });

    const logs = notificationService.getLogsForUser(userId);
    expect(logs).toHaveLength(1);
    expect(logs[0].subject).toContain(intent.id);
  });

  it('runs the full pipeline end-to-end and asserts the final order state', async () => {
    const cart = await cartService.addItem(userId, {
      productId: 'prod_1',
      name: 'Workshop T-Shirt',
      price: 100,
      quantity: 1,
    });

    const discount = discountService.apply('SAVE10', cart.subtotal);

    const fraudResult = fraudService.check({
      userId,
      orderAmount: discount.finalTotal,
      itemCount: cart.items.length,
      ipCountry: 'DE',
    });
    expect(fraudResult.approved).toBe(true);

    const intent = paymentService.charge({ userId, amount: discount.finalTotal });
    const captured = paymentService.capture(intent.id);
    expect(captured.status).toBe('captured');

    notificationService.send({
      userId,
      type: 'receipt',
      email: 'alice@example.com',
      subject: `Receipt for ${intent.id}`,
    });

    const logs = notificationService.getLogsForUser(userId);
    expect(logs).toHaveLength(1);

    await cartService.clearCart(userId);
    const clearedCart = await cartService.getCart(userId);
    expect(clearedCart.items).toHaveLength(0);
  });
});
