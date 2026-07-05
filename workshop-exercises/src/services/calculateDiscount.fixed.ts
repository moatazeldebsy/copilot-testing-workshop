/**
 * Fixed version of calculateDiscount — reference for Exercise A's solution.
 * Compare with calculateDiscount.ts to see all three bug fixes.
 *
 * Copy this file over calculateDiscount.ts to make the unit tests go green.
 */

export type DiscountCode = 'SAVE10' | 'FLAT5' | string;

export interface DiscountInput {
  subtotal: number;
  code: DiscountCode;
}

export interface DiscountOutput {
  code: string;
  discountAmount: number;
  finalTotal: number;
}

interface DiscountRule {
  type: 'percent' | 'flat';
  value: number;
  minOrder?: number;
}

const DISCOUNT_RULES: Record<string, DiscountRule> = {
  SAVE10: { type: 'percent', value: 10 },
  FLAT5:  { type: 'flat', value: 5, minOrder: 20 },
};

export function calculateDiscount(input: DiscountInput): DiscountOutput {
  const rule = DISCOUNT_RULES[input.code.toUpperCase()];

  if (!rule) {
    return { code: input.code, discountAmount: 0, finalTotal: input.subtotal };
  }

  let discountAmount: number;

  if (rule.type === 'percent') {
    discountAmount = input.subtotal * (rule.value / 100); // FIX 1: / 100, not / 10
  } else {
    // FIX 2: enforce minimum order
    if (rule.minOrder !== undefined && input.subtotal < rule.minOrder) {
      discountAmount = 0;
    } else {
      discountAmount = rule.value;
    }
  }

  // FIX 3: clamp finalTotal to 0
  const finalTotal = Math.max(0, input.subtotal - discountAmount);

  return { code: input.code, discountAmount, finalTotal };
}
