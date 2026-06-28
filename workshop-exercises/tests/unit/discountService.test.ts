/**
 * BONUS — DiscountService unit tests (not a timed exercise)
 *
 * The discount pure function is covered in Exercise A (calculateDiscount.test.ts).
 * The discount API endpoint is covered in Exercise C (checkout.test.ts).
 * Use this file if you finish early or want to compare service vs pure-function testing.
 */

import { DiscountRepository } from '../../src/repositories/discountRepository';
import { DiscountService } from '../../src/services/discountService';

describe('DiscountService', () => {
  let discountService: DiscountService;

  beforeEach(() => {
    const repo = new DiscountRepository();
    discountService = new DiscountService(repo);
  });

  it('validates a valid promo code without error', () => {
    // TODO: use Copilot to generate this test
  });

  it('throws INVALID_DISCOUNT_CODE for an unknown code', () => {
    // TODO: use Copilot to generate this test
  });

  it('throws DISCOUNT_EXPIRED for an expired code', () => {
    // TODO: use Copilot to generate this test
  });

  it('applies a percent discount correctly (SAVE10)', () => {
    // TODO: use Copilot to generate this test
  });

  it('applies a flat discount correctly (FLAT5)', () => {
    // TODO: use Copilot to generate this test
  });

  it('throws ORDER_BELOW_MINIMUM when order is too small for FLAT5', () => {
    // TODO: use Copilot to generate this test
  });
});
