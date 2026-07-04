/**
 * INTEGRATION DEMO — service-layer pipeline
 *
 * Unlike tests/api (HTTP via Supertest) or tests/unit (one function in
 * isolation), this tier exercises real wiring across modules by calling the
 * exported service singletons directly: Cart -> Discount -> Fraud -> Payment
 * -> Notification. No HTTP layer, no mocks — just the real objects wired
 * together, the way they run in production.
 */

import { resetWorkshopData, cartService, discountService, fraudService, paymentService, notificationService, userService } from '../../src/app';

describe('checkout pipeline (integration)', () => {
  let userId: string;

  beforeEach(async () => {
    await resetWorkshopData();
    const { user } = await userService.authenticate('alice@example.com', 'workshop-password');
    userId = user.id;
  });

  it.todo('adds an item via cartService and reflects it in the cart total');

  it.todo('applies a discount via discountService on top of the cart subtotal');

  it.todo('approves a low-risk order via fraudService for the same cart');

  it.todo('charges, captures, and refunds a payment via paymentService');

  it.todo('sends and retrieves a receipt via notificationService after payment');

  it.todo('runs the full pipeline end-to-end and asserts the final order state');
});
