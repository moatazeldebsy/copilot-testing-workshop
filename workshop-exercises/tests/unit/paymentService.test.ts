/**
 * BONUS — PaymentService unit tests (not a timed exercise)
 *
 * Payment lifecycle (charge → capture → refund) is covered at the API level
 * in Exercise C (checkout.test.ts). Use this file if you finish early —
 * the state machine (pending → captured → refunded) is a good prompt target.
 */

import { ApiError } from '../../src/errors/apiError';
import { PaymentRepository } from '../../src/repositories/paymentRepository';
import { PaymentService } from '../../src/services/paymentService';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    const repo = new PaymentRepository();
    paymentService = new PaymentService(repo);
  });

  it('creates a payment intent in pending state', () => {
    // Act
    const intent = paymentService.charge({ userId: 'user-1', amount: 100 });

    // Assert
    expect(intent.status).toBe('pending');
    expect(intent.amount).toBe(100);
    expect(intent.id).toMatch(/^pi_/);
  });

  it('captures a pending payment intent', () => {
    // Arrange
    const intent = paymentService.charge({ userId: 'user-1', amount: 100 });

    // Act
    const captured = paymentService.capture(intent.id);

    // Assert
    expect(captured.status).toBe('captured');
  });

  it('throws INVALID_PAYMENT_STATE when capturing a non-pending intent', () => {
    expect.assertions(2);

    // Arrange — capture once so the intent is no longer pending
    const intent = paymentService.charge({ userId: 'user-1', amount: 100 });
    paymentService.capture(intent.id);

    // Act
    try {
      paymentService.capture(intent.id);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('INVALID_PAYMENT_STATE');
    }
  });

  it('refunds a captured payment intent', () => {
    // Arrange
    const intent = paymentService.charge({ userId: 'user-1', amount: 100 });
    paymentService.capture(intent.id);

    // Act
    const refunded = paymentService.refund(intent.id);

    // Assert
    expect(refunded.status).toBe('refunded');
  });

  it('throws INVALID_PAYMENT_STATE when refunding a pending intent', () => {
    expect.assertions(2);

    // Arrange — never captured
    const intent = paymentService.charge({ userId: 'user-1', amount: 100 });

    // Act
    try {
      paymentService.refund(intent.id);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('INVALID_PAYMENT_STATE');
    }
  });

  it('throws PAYMENT_NOT_FOUND for an unknown intent ID', () => {
    expect.assertions(2);

    try {
      paymentService.capture('pi_does-not-exist');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('PAYMENT_NOT_FOUND');
    }
  });
});
