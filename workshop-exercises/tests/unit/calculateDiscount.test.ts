/**
 * EXERCISE A — Write unit tests for calculateDiscount
 *
 * src/services/calculateDiscount.ts has 3 intentional bugs. Use Copilot to
 * generate tests for the discount rules below. Strong tests will fail and
 * reveal the bugs; weak tests will pass and hide them (see Exercise B for
 * an example of the latter).
 *
 * Discount rules to cover:
 *   - SAVE10: 10% off any order (case-insensitive code)
 *   - FLAT5: $5 off orders of $20 or more (not below the minimum)
 *   - Unknown codes: no discount applied
 *   - finalTotal should never go negative
 */

import { calculateDiscount } from '../../src/services/calculateDiscount';

describe('calculateDiscount', () => {
  describe('SAVE10 — 10% off any order', () => {
    it.todo('deducts exactly 10% from the subtotal');
    it.todo('is case-insensitive (save10 == SAVE10)');
    it.todo('handles non-round subtotals');
    it.todo('returns zero discount on a $0 subtotal');
  });

  describe('FLAT5 — $5 off orders of $20 or more', () => {
    it.todo('deducts exactly $5 when the order meets the minimum');
    it.todo('does NOT apply the discount when subtotal is below $20');
    it.todo('applies the discount at exactly the $20 minimum boundary');
  });

  describe('edge cases and invariants', () => {
    it.todo('returns zero discount for an unknown code');
    it.todo('finalTotal is never negative even when discount exceeds subtotal');
  });
});
