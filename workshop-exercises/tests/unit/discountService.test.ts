/**
 * BONUS — DiscountService unit tests (not a timed exercise)
 *
 * The discount pure function is covered in Exercise A (calculateDiscount.test.ts).
 * The discount API endpoint is covered in Exercise C (checkout.test.ts).
 * Use this file if you finish early or want to compare service vs pure-function testing.
 */

import { ApiError } from '../../src/errors/apiError';
import { DiscountRepository } from '../../src/repositories/discountRepository';
import { DiscountService } from '../../src/services/discountService';

describe('DiscountService', () => {
  let discountService: DiscountService;

  beforeEach(() => {
    const repo = new DiscountRepository();
    discountService = new DiscountService(repo);
  });

  it('validates a valid promo code without error', () => {
    expect(() => discountService.validate('SAVE10')).not.toThrow();
  });

  it('throws INVALID_DISCOUNT_CODE for an unknown code', () => {
    expect.assertions(2);

    try {
      discountService.validate('NOPE');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('INVALID_DISCOUNT_CODE');
    }
  });

  it('throws DISCOUNT_EXPIRED for an expired code', () => {
    expect.assertions(2);

    try {
      discountService.validate('EXPIRED');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('DISCOUNT_EXPIRED');
    }
  });

  it('applies a percent discount correctly (SAVE10)', () => {
    // Act
    const result = discountService.apply('SAVE10', 100);

    // Assert
    expect(result.discountAmount).toBe(10);
    expect(result.finalTotal).toBe(90);
  });

  it('applies a flat discount correctly (FLAT5)', () => {
    // Act
    const result = discountService.apply('FLAT5', 50);

    // Assert
    expect(result.discountAmount).toBe(5);
    expect(result.finalTotal).toBe(45);
  });

  it('throws ORDER_BELOW_MINIMUM when order is too small for FLAT5', () => {
    expect.assertions(2);

    try {
      discountService.apply('FLAT5', 10);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe('ORDER_BELOW_MINIMUM');
    }
  });
});
