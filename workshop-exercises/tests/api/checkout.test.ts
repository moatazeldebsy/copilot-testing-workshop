import request from 'supertest';
import { app, resetWorkshopData } from '../../src/app';

describe('Checkout pipeline API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await resetWorkshopData();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'workshop-password' });

    token = login.body.data.token as string;
    userId = login.body.data.user.id as string;
  });

  // --- Cart ---
  // TODO: use Copilot to generate this test
  it.todo('returns an empty cart for a new user');

  // TODO: use Copilot to generate this test
  it.todo('adds an item to the cart');

  // TODO: use Copilot to generate this test
  it.todo('removes an item from the cart');

  // --- Discount ---
  // TODO: use Copilot to generate this test
  it.todo('validates a valid promo code');

  // TODO: use Copilot to generate this test
  it.todo('applies SAVE10 discount and returns final total');

  // TODO: use Copilot to generate this test
  it.todo('rejects an expired promo code with 400');

  // --- Fraud ---
  // TODO: use Copilot to generate this test
  it.todo('approves a low-risk order');

  // TODO: use Copilot to generate this test
  it.todo('rejects a high-risk order');

  // --- Payment ---
  // TODO: use Copilot to generate this test
  it.todo('creates, captures, and refunds a payment intent');

  // --- Notification ---
  // TODO: use Copilot to generate this test
  it.todo('sends a receipt notification and retrieves logs');

  // --- Full flow ---
  // TODO: use Copilot to generate this test
  // Hint: add to cart → apply discount → check fraud → charge → capture → send receipt
  it.todo('completes the full checkout pipeline end-to-end');
});
