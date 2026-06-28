/**
 * Exercise C solution — complete API tests for the checkout pipeline.
 * This file lives alongside checkout.test.ts (which has empty stubs).
 *
 * Participants fill in checkout.test.ts; this file is the reference answer
 * available on the 03-api-testing branch.
 */

import request from 'supertest';
import { app, resetWorkshopData } from '../../src/app';

describe('Checkout pipeline API (solution)', () => {
  let token: string;
  let userId: string;
  const headers = () => ({ Authorization: `Bearer ${token}` });

  beforeEach(async () => {
    await resetWorkshopData();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'workshop-password' });

    token = login.body.data.token as string;
    userId = login.body.data.user.id as string;
  });

  // ---------------------------------------------------------------------------
  // Cart
  // ---------------------------------------------------------------------------

  it('returns an empty cart for a new user', async () => {
    // Arrange — nothing to add

    // Act
    const res = await request(app)
      .get(`/api/cart/${userId}`)
      .set(headers());

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.items).toEqual([]);
    expect(res.body.data.subtotal).toBe(0);
  });

  it('adds an item to the cart', async () => {
    // Arrange
    const item = { productId: 'prod-1', name: 'Widget', price: 25, quantity: 2 };

    // Act
    const res = await request(app)
      .post(`/api/cart/${userId}/items`)
      .set(headers())
      .send(item);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].productId).toBe('prod-1');
    expect(res.body.data.items[0].quantity).toBe(2);
    expect(res.body.data.subtotal).toBe(50);
  });

  it('merges quantities when the same product is added twice', async () => {
    // Arrange
    const item = { productId: 'prod-1', name: 'Widget', price: 25, quantity: 1 };

    // Act
    await request(app).post(`/api/cart/${userId}/items`).set(headers()).send(item);
    const res = await request(app).post(`/api/cart/${userId}/items`).set(headers()).send(item);

    // Assert
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  it('removes an item from the cart', async () => {
    // Arrange
    const addRes = await request(app)
      .post(`/api/cart/${userId}/items`)
      .set(headers())
      .send({ productId: 'prod-1', name: 'Widget', price: 25, quantity: 1 });
    const itemId = addRes.body.data.items[0].id as string;

    // Act
    const res = await request(app)
      .delete(`/api/cart/${userId}/items/${itemId}`)
      .set(headers());

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.items).toEqual([]);
  });

  it('returns 404 when removing a non-existent cart item', async () => {
    const res = await request(app)
      .delete(`/api/cart/${userId}/items/does-not-exist`)
      .set(headers());
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ITEM_NOT_FOUND');
  });

  // ---------------------------------------------------------------------------
  // Discount
  // ---------------------------------------------------------------------------

  it('validates a valid promo code', async () => {
    const res = await request(app)
      .post('/api/discount/validate')
      .set(headers())
      .send({ code: 'SAVE10' });

    expect(res.status).toBe(200);
    expect(res.body.data.valid).toBe(true);
  });

  it('applies SAVE10 and returns the correct discount amount', async () => {
    // Act
    const res = await request(app)
      .post('/api/discount/apply')
      .set(headers())
      .send({ code: 'SAVE10', subtotal: 100 });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.discountAmount).toBe(10);
    expect(res.body.data.finalTotal).toBe(90);
  });

  it('rejects FLAT5 when order is below $20 minimum', async () => {
    const res = await request(app)
      .post('/api/discount/apply')
      .set(headers())
      .send({ code: 'FLAT5', subtotal: 10 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('ORDER_BELOW_MINIMUM');
  });

  it('rejects an expired promo code with 400 DISCOUNT_EXPIRED', async () => {
    const res = await request(app)
      .post('/api/discount/apply')
      .set(headers())
      .send({ code: 'EXPIRED', subtotal: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('DISCOUNT_EXPIRED');
  });

  it('rejects an unknown promo code with 404 INVALID_DISCOUNT_CODE', async () => {
    const res = await request(app)
      .post('/api/discount/apply')
      .set(headers())
      .send({ code: 'NOPE', subtotal: 100 });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('INVALID_DISCOUNT_CODE');
  });

  // ---------------------------------------------------------------------------
  // Fraud
  // ---------------------------------------------------------------------------

  it('approves a low-risk order (score < 25)', async () => {
    const res = await request(app)
      .post('/api/fraud/check')
      .set(headers())
      .send({ userId, orderAmount: 50, itemCount: 2, ipCountry: 'DE' });

    expect(res.status).toBe(200);
    expect(res.body.data.approved).toBe(true);
    expect(res.body.data.riskLevel).toBe('low');
  });

  it('blocks a high-risk order (score ≥ 50)', async () => {
    // High-risk country XX → +50 alone pushes to 'high'
    const res = await request(app)
      .post('/api/fraud/check')
      .set(headers())
      .send({ userId, orderAmount: 50, itemCount: 2, ipCountry: 'XX' });

    expect(res.status).toBe(200);
    expect(res.body.data.approved).toBe(false);
    expect(res.body.data.riskLevel).toBe('high');
  });

  // ---------------------------------------------------------------------------
  // Payment
  // ---------------------------------------------------------------------------

  it('creates a pending payment intent', async () => {
    const res = await request(app)
      .post('/api/payment/charge')
      .set(headers())
      .send({ userId, amount: 100, currency: 'USD' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.id).toBeDefined();
  });

  it('captures a pending payment intent', async () => {
    // Arrange
    const charge = await request(app)
      .post('/api/payment/charge')
      .set(headers())
      .send({ userId, amount: 100, currency: 'USD' });
    const paymentId = charge.body.data.id as string;

    // Act
    const res = await request(app)
      .post(`/api/payment/${paymentId}/capture`)
      .set(headers());

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('captured');
  });

  it('refunds a captured payment', async () => {
    // Arrange — charge then capture
    const charge = await request(app)
      .post('/api/payment/charge')
      .set(headers())
      .send({ userId, amount: 100, currency: 'USD' });
    const paymentId = charge.body.data.id as string;
    await request(app).post(`/api/payment/${paymentId}/capture`).set(headers());

    // Act
    const res = await request(app)
      .post(`/api/payment/${paymentId}/refund`)
      .set(headers());

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('refunded');
  });

  it('rejects refunding a pending (not yet captured) payment', async () => {
    // Arrange
    const charge = await request(app)
      .post('/api/payment/charge')
      .set(headers())
      .send({ userId, amount: 100, currency: 'USD' });
    const paymentId = charge.body.data.id as string;

    // Act
    const res = await request(app)
      .post(`/api/payment/${paymentId}/refund`)
      .set(headers());

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PAYMENT_STATE');
  });

  // ---------------------------------------------------------------------------
  // Notification
  // ---------------------------------------------------------------------------

  it('sends a receipt notification and retrieves it by userId', async () => {
    // Arrange
    const payload = {
      userId,
      type: 'receipt',
      email: 'alice@example.com',
      subject: 'Your receipt',
      body: 'Thanks!',
    };

    // Act — send
    const sendRes = await request(app)
      .post('/api/notifications/receipt')
      .set(headers())
      .send(payload);

    expect(sendRes.status).toBe(201);
    expect(sendRes.body.data.type).toBe('receipt');

    // Act — retrieve
    const getRes = await request(app)
      .get(`/api/notifications/${userId}`)
      .set(headers());

    // Assert
    expect(getRes.status).toBe(200);
    expect(getRes.body.data).toHaveLength(1);
    expect(getRes.body.data[0].userId).toBe(userId);
  });

  // ---------------------------------------------------------------------------
  // Full pipeline
  // ---------------------------------------------------------------------------

  it('completes the full checkout pipeline end-to-end', async () => {
    // 1. Add items to cart
    await request(app)
      .post(`/api/cart/${userId}/items`)
      .set(headers())
      .send({ productId: 'prod-1', name: 'Widget', price: 50, quantity: 2 });

    // 2. Apply discount
    const discount = await request(app)
      .post('/api/discount/apply')
      .set(headers())
      .send({ code: 'SAVE10', subtotal: 100 });
    expect(discount.body.data.finalTotal).toBe(90);

    // 3. Fraud check
    const fraud = await request(app)
      .post('/api/fraud/check')
      .set(headers())
      .send({ userId, orderAmount: 90, itemCount: 2, ipCountry: 'DE' });
    expect(fraud.body.data.approved).toBe(true);

    // 4. Charge
    const charge = await request(app)
      .post('/api/payment/charge')
      .set(headers())
      .send({ userId, amount: 90, currency: 'USD' });
    const paymentId = charge.body.data.id as string;
    expect(charge.body.data.status).toBe('pending');

    // 5. Capture
    const capture = await request(app)
      .post(`/api/payment/${paymentId}/capture`)
      .set(headers());
    expect(capture.body.data.status).toBe('captured');

    // 6. Send receipt
    const receipt = await request(app)
      .post('/api/notifications/receipt')
      .set(headers())
      .send({
        userId,
        type: 'receipt',
        email: 'alice@example.com',
        subject: `Receipt for order ${paymentId}`,
        body: 'Your order is confirmed.',
      });
    expect(receipt.status).toBe(201);
    expect(receipt.body.data.type).toBe('receipt');
  });
});
