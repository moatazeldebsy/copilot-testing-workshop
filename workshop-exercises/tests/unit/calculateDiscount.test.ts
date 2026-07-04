import { calculateDiscount } from '../../src/services/calculateDiscount';

describe('calculateDiscount', () => {
  describe('SAVE10 — 10% off any order', () => {
    it('deducts exactly 10% from the subtotal', () => {
      // Arrange
      const input = { subtotal: 100, code: 'SAVE10' };

      // Act
      const result = calculateDiscount(input);

      // Assert
      expect(result.discountAmount).toBe(10);
      expect(result.finalTotal).toBe(90);
    });

    it('is case-insensitive (save10 == SAVE10)', () => {
      // Arrange & Act
      const upper = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
      const lower = calculateDiscount({ subtotal: 100, code: 'save10' });

      // Assert
      expect(lower.discountAmount).toBe(upper.discountAmount);
      expect(lower.finalTotal).toBe(upper.finalTotal);
      expect(upper.discountAmount).toBe(10);
    });

    it('handles non-round subtotals', () => {
      // Arrange
      const input = { subtotal: 33, code: 'SAVE10' };

      // Act
      const result = calculateDiscount(input);

      // Assert
      expect(result.discountAmount).toBeCloseTo(3.3, 2);
      expect(result.finalTotal).toBeCloseTo(29.7, 2);
    });

    it('returns zero discount on a $0 subtotal', () => {
      const result = calculateDiscount({ subtotal: 0, code: 'SAVE10' });
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(0);
    });
  });

  describe('FLAT5 — $5 off orders of $20 or more', () => {
    it('deducts exactly $5 when the order meets the minimum', () => {
      // Arrange
      const input = { subtotal: 50, code: 'FLAT5' };

      // Act
      const result = calculateDiscount(input);

      // Assert
      expect(result.discountAmount).toBe(5);
      expect(result.finalTotal).toBe(45);
    });

    it('does NOT apply the discount when subtotal is below $20', () => {
      // Arrange
      const input = { subtotal: 15, code: 'FLAT5' };

      // Act
      const result = calculateDiscount(input);

      // Assert — $5 off a $15 order should NOT be granted
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(15);
    });

    it('applies the discount at exactly the $20 minimum boundary', () => {
      const result = calculateDiscount({ subtotal: 20, code: 'FLAT5' });
      expect(result.discountAmount).toBe(5);
      expect(result.finalTotal).toBe(15);
    });

    it('does NOT apply at $19.99 (one cent below minimum)', () => {
      const result = calculateDiscount({ subtotal: 19.99, code: 'FLAT5' });
      expect(result.discountAmount).toBe(0);
    });
  });

  describe('edge cases and invariants', () => {
    it('returns zero discount for an unknown code', () => {
      const result = calculateDiscount({ subtotal: 100, code: 'INVALID' });
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(100);
    });

    it('finalTotal is never negative even when discount exceeds subtotal', () => {
      // FLAT5 on a $3 order: discount ($5) > subtotal ($3)
      const result = calculateDiscount({ subtotal: 3, code: 'FLAT5' });
      expect(result.finalTotal).toBeGreaterThanOrEqual(0);
    });

    it('includes the original code in the result', () => {
      const result = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
      expect(result.code).toBe('SAVE10');
    });
  });
});
