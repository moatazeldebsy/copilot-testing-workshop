export type DiscountType = 'percent' | 'flat';

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  expiresAt: Date | null;
  minOrderAmount: number;
}

export interface DiscountResult {
  code: string;
  type: DiscountType;
  value: number;
  discountAmount: number;
  finalTotal: number;
}
