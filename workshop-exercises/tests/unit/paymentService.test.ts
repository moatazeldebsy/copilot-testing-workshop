/**
 * BONUS — PaymentService unit tests (not a timed exercise)
 *
 * Payment lifecycle (charge → capture → refund) is covered at the API level
 * in Exercise C (checkout.test.ts). Use this file if you finish early —
 * the state machine (pending → captured → refunded) is a good prompt target.
 */

import { PaymentRepository } from '../../src/repositories/paymentRepository';
import { PaymentService } from '../../src/services/paymentService';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    const repo = new PaymentRepository();
    paymentService = new PaymentService(repo);
  });

  // TODO: use Copilot to generate this test
  it.todo('creates a payment intent in pending state');

  // TODO: use Copilot to generate this test
  it.todo('captures a pending payment intent');

  // TODO: use Copilot to generate this test
  it.todo('throws INVALID_PAYMENT_STATE when capturing a non-pending intent');

  // TODO: use Copilot to generate this test
  it.todo('refunds a captured payment intent');

  // TODO: use Copilot to generate this test
  it.todo('throws INVALID_PAYMENT_STATE when refunding a pending intent');

  // TODO: use Copilot to generate this test
  it.todo('throws PAYMENT_NOT_FOUND for an unknown intent ID');
});
