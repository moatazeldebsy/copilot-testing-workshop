import { type DiscountCode } from '../models/discount';

const SEED_CODES: DiscountCode[] = [
  { code: 'SAVE10', type: 'percent', value: 10, expiresAt: null, minOrderAmount: 0 },
  { code: 'FLAT5', type: 'flat', value: 5, expiresAt: null, minOrderAmount: 20 },
  { code: 'EXPIRED', type: 'percent', value: 15, expiresAt: new Date('2020-01-01'), minOrderAmount: 0 },
];

export class DiscountRepository {
  private codes: DiscountCode[] = [...SEED_CODES];

  findByCode(code: string): DiscountCode | null {
    return this.codes.find((c) => c.code === code.toUpperCase()) ?? null;
  }

  reset(): void {
    this.codes = [...SEED_CODES];
  }
}
