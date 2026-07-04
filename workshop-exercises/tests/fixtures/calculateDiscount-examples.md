# Fixture: calculateDiscount — Pre-generated test examples

Use these if Copilot or Wi-Fi is unavailable during Exercise A.
Copy into `tests/unit/calculateDiscount.test.ts` and run `npm test`.

---

## Strong tests (Exercise A target output)

```typescript
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

    it('is case-insensitive', () => {
      const upper = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
      const lower = calculateDiscount({ subtotal: 100, code: 'save10' });
      expect(lower.discountAmount).toBe(upper.discountAmount);
    });

    it('works on non-round numbers', () => {
      const result = calculateDiscount({ subtotal: 33, code: 'SAVE10' });
      expect(result.discountAmount).toBeCloseTo(3.3, 2);
      expect(result.finalTotal).toBeCloseTo(29.7, 2);
    });
  });

  describe('FLAT5 — $5 off orders of $20+', () => {
    it('deducts exactly $5 when order meets the minimum', () => {
      const result = calculateDiscount({ subtotal: 50, code: 'FLAT5' });
      expect(result.discountAmount).toBe(5);
      expect(result.finalTotal).toBe(45);
    });

    it('does NOT apply when subtotal is below the $20 minimum', () => {
      const result = calculateDiscount({ subtotal: 15, code: 'FLAT5' });
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(15);
    });

    it('applies at exactly the minimum boundary ($20)', () => {
      const result = calculateDiscount({ subtotal: 20, code: 'FLAT5' });
      expect(result.discountAmount).toBe(5);
      expect(result.finalTotal).toBe(15);
    });
  });

  describe('edge cases', () => {
    it('returns zero discount for an unknown code', () => {
      const result = calculateDiscount({ subtotal: 100, code: 'INVALID' });
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(100);
    });

    it('finalTotal is never negative', () => {
      // FLAT5 on a $3 order: discount ($5) > subtotal ($3)
      const result = calculateDiscount({ subtotal: 3, code: 'FLAT5' });
      expect(result.finalTotal).toBeGreaterThanOrEqual(0);
    });

    it('handles a $0 subtotal without throwing', () => {
      const result = calculateDiscount({ subtotal: 0, code: 'SAVE10' });
      expect(result.discountAmount).toBe(0);
      expect(result.finalTotal).toBe(0);
    });
  });
});
```

---

## What these tests reveal about the buggy implementation

Run `npm test -- --testPathPattern calculateDiscount` after copying the above.
You should see 3 failing tests that expose the bugs:

| Test | Bug exposed |
|---|---|
| `deducts exactly 10% from the subtotal` | `/ 10` instead of `/ 100` — gives $100 off, not $10 |
| `does NOT apply when subtotal is below the $20 minimum` | Missing minOrder guard — gives $5 off anyway |
| `finalTotal is never negative` | No clamping — $3 - $5 = -$2 |

---

## Backup: API test examples (Exercise C)

```typescript
// Full golden-path checkout via the API
it('completes a full checkout flow', async () => {
  // 1. Login
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'workshop-password' });
  const { token, user } = login.body.data;
  const userId = user.id;

  const headers = { Authorization: `Bearer ${token}` };

  // 2. Add item to cart
  await request(app)
    .post(`/api/cart/${userId}/items`)
    .set(headers)
    .send({ productId: 'prod-1', name: 'Widget', price: 50, quantity: 2 });

  // 3. Apply discount
  const discount = await request(app)
    .post('/api/discount/apply')
    .set(headers)
    .send({ code: 'SAVE10', subtotal: 100 });
  expect(discount.body.data.discountAmount).toBe(10);
  expect(discount.body.data.finalTotal).toBe(90);

  // 4. Fraud check
  const fraud = await request(app)
    .post('/api/fraud/check')
    .set(headers)
    .send({ userId, orderAmount: 90, itemCount: 2, ipCountry: 'DE' });
  expect(fraud.body.data.approved).toBe(true);

  // 5. Charge
  const charge = await request(app)
    .post('/api/payment/charge')
    .set(headers)
    .send({ userId, amount: 90, currency: 'USD' });
  const paymentId = charge.body.data.id;
  expect(charge.body.data.status).toBe('pending');

  // 6. Capture
  const capture = await request(app)
    .post(`/api/payment/${paymentId}/capture`)
    .set(headers);
  expect(capture.body.data.status).toBe('captured');

  // 7. Receipt
  const receipt = await request(app)
    .post('/api/notifications/receipt')
    .set(headers)
    .send({
      userId,
      email: 'alice@example.com',
      subject: 'Your order is confirmed!',
      body: `Payment ${paymentId} captured. Thank you!`,
      metadata: { paymentId },
    });
  expect(receipt.body.data.type).toBe('receipt');
});
```
