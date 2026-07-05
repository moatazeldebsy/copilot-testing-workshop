/**
 * BONUS — FraudService unit tests (not a timed exercise)
 *
 * Fraud check is covered at the API level in Exercise C (checkout.test.ts).
 * Use this file if you finish early — FraudService has clear scoring rules
 * that make great Copilot prompts (amount thresholds, country blocks, item counts).
 */

import { FraudService } from '../../src/services/fraudService';

describe('FraudService', () => {
  let fraudService: FraudService;

  beforeEach(() => {
    fraudService = new FraudService();
  });

  it('approves a low-risk order', () => {
    // Act
    const result = fraudService.check({ userId: 'user-1', orderAmount: 50, itemCount: 2 });

    // Assert
    expect(result.approved).toBe(true);
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBe(0);
  });

  it('flags an order over $1000 as high risk', () => {
    // Arrange & Act — a high-value order alone contributes +40, enough to leave
    // "low" behind (>=25 is "medium"); it takes a second factor to reach "high" (>=50).
    const result = fraudService.check({ userId: 'user-1', orderAmount: 1500, itemCount: 2 });

    // Assert
    expect(result.riskScore).toBe(40);
    expect(result.riskLevel).toBe('medium');
    expect(result.reasons).toContain('Order amount exceeds high-value threshold');
  });

  it('flags an order with more than 20 items', () => {
    // Act
    const result = fraudService.check({ userId: 'user-1', orderAmount: 50, itemCount: 25 });

    // Assert
    expect(result.riskScore).toBe(30);
    expect(result.riskLevel).toBe('medium');
    expect(result.reasons).toContain('Unusually large number of items');
  });

  it('rejects an order from a high-risk country', () => {
    // Act
    const result = fraudService.check({ userId: 'user-1', orderAmount: 50, itemCount: 2, ipCountry: 'XX' });

    // Assert
    expect(result.riskScore).toBe(50);
    expect(result.riskLevel).toBe('high');
    expect(result.approved).toBe(false);
    expect(result.reasons).toContain('Order originates from a high-risk region');
  });

  it('returns the correct riskScore and reasons array', () => {
    // Act — high amount (+40) and too many items (+30) combine past the "high" threshold
    const result = fraudService.check({ userId: 'user-1', orderAmount: 1500, itemCount: 25 });

    // Assert
    expect(result.riskScore).toBe(70);
    expect(result.riskLevel).toBe('high');
    expect(result.approved).toBe(false);
    expect(result.reasons).toEqual([
      'Order amount exceeds high-value threshold',
      'Unusually large number of items',
    ]);
  });
});
