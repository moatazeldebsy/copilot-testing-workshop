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
  expiresAt?: Date;
}

const DISCOUNT_RULES: Record<string, DiscountRule> = {
  SAVE10: { type: 'percent', value: 10 },
  FLAT5:  { type: 'flat', value: 5, minOrder: 20 },
};

// BUG 1: percent discount divides by 10 instead of 100
//         SAVE10 on $100 gives $100 off (100%) instead of $10 off (10%)
// BUG 2: FLAT5 minimum-order guard is missing — $5 off even on a $3 order
// BUG 3: finalTotal is never clamped — can go negative
export function calculateDiscount(input: DiscountInput): DiscountOutput {
  const rule = DISCOUNT_RULES[input.code.toUpperCase()];

  if (!rule) {
    return { code: input.code, discountAmount: 0, finalTotal: input.subtotal };
  }

  let discountAmount: number;

  if (rule.type === 'percent') {
    discountAmount = input.subtotal * (rule.value / 10); // ← BUG 1
  } else {
    discountAmount = rule.value; // ← BUG 2: ignores rule.minOrder
  }

  return {
    code: input.code,
    discountAmount,
    finalTotal: input.subtotal - discountAmount, // ← BUG 3: can be negative
  };
}
