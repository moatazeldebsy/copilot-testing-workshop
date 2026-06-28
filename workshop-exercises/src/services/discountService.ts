import { ApiError } from '../errors/apiError';
import { type DiscountResult } from '../models/discount';
import { DiscountRepository } from '../repositories/discountRepository';

export class DiscountService {
  constructor(private readonly repo: DiscountRepository) {}

  validate(code: string): void {
    const discount = this.repo.findByCode(code);

    if (!discount) {
      throw new ApiError(404, 'INVALID_DISCOUNT_CODE', 'Discount code not found');
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      throw new ApiError(400, 'DISCOUNT_EXPIRED', 'Discount code has expired');
    }
  }

  apply(code: string, subtotal: number): DiscountResult {
    const discount = this.repo.findByCode(code);

    if (!discount) {
      throw new ApiError(404, 'INVALID_DISCOUNT_CODE', 'Discount code not found');
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      throw new ApiError(400, 'DISCOUNT_EXPIRED', 'Discount code has expired');
    }

    if (subtotal < discount.minOrderAmount) {
      throw new ApiError(
        400,
        'ORDER_BELOW_MINIMUM',
        `Order must be at least $${discount.minOrderAmount.toFixed(2)} to use this code`,
      );
    }

    let discountAmount: number;
    if (discount.type === 'percent') {
      discountAmount = Math.round(subtotal * (discount.value / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(discount.value, subtotal);
    }

    return {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount,
      finalTotal: Math.round((subtotal - discountAmount) * 100) / 100,
    };
  }
}
