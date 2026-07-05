import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import LanguageTabs from '../../components/LanguageTabs';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';
import PollBlock from '../../components/PollBlock';
import TimedExercise from '../../components/TimedExercise';

const ApiIntegration: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Exercise C</span>
      <h1>API &amp; Integration Tests</h1>
      <PageMeta duration="25 min" difficulty="intermediate" />
      <p className="page-lead">
        In this exercise you will use Copilot to generate Supertest coverage for
        the full checkout pipeline — Cart → Discount → Fraud → Payment →
        Notification. Copilot is effective at scaffolding route contracts, but it
        cannot know your specific status codes or error shapes without context.
        Attaching <code>domain-rules.md</code> is what turns generic scaffolding
        into domain-aware assertions.
      </p>

      <ExerciseRepoCallout path="/workshop/api-integration" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#api-generate">Jump to generation</a>
        <a href="#api-exercise">Jump to exercise</a>
        <a href="#api-debrief">Jump to debrief</a>
      </div>

      <PollBlock
        mode="quiz"
        quizId="api-integration-default-strategy"
        question="For your default API tests, where do you get the fastest, most reliable feedback?"
        options={[
          {
            emoji: '⚡',
            label: 'Supertest + mocked service layer',
            rationale: 'Fast and stable for route contracts, but incomplete if used alone. Pair with selected integration tests for persistence behavior.',
          },
          {
            emoji: '🗄️',
            label: 'Real DB integration tests only',
            rationale: 'High confidence for end-to-end behavior, but usually too slow and brittle as the only feedback loop.',
          },
          {
            emoji: '🧪',
            label: 'A mix of route tests and focused integration tests',
            rationale: 'Best default in most teams: quick route feedback plus targeted full-stack validation where data behavior matters.',
            isCorrect: true,
          },
          {
            emoji: '🤷',
            label: 'Not sure yet',
            rationale: 'Use this step to start with route tests first, then add one integration path for confidence in checkout state.',
          },
        ]}
        note="Pick a strategy, reveal rationale, then align your first implementation slice with the recommendation."
      />

      <ArchDiagram
        title="Checkout Pipeline Under Test"
        nodes={[
          { label: 'Test File', icon: '🧪' },
          { label: 'Supertest', icon: '📡' },
          { label: 'Express App', icon: '🔌' },
          { label: 'Cart / Discount / Fraud', icon: '⚙️' },
          { label: 'In-Memory Store', icon: '🗄️' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'uses' },
          { from: 1, to: 2, label: 'HTTP request' },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
        ]}
      />

      <h2>The Checkout Pipeline</h2>
      <p>
        Every exercise in this workshop runs against the same sample checkout
        system. The API tests in this step cover the full pipeline:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Key Routes</th>
            <th>What to test</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cart</td>
            <td><code>POST /api/cart/:userId/items</code></td>
            <td>Add item, merge duplicate products, reject invalid price/quantity</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td><code>POST /api/discount/apply</code></td>
            <td>Valid codes, expired codes, unknown codes, minimum-order gate</td>
          </tr>
          <tr>
            <td>Fraud</td>
            <td><code>POST /api/fraud/check</code></td>
            <td>Low-risk approval, high-risk block, blacklisted country</td>
          </tr>
          <tr>
            <td>Payment</td>
            <td><code>POST /api/payment/capture</code></td>
            <td>Successful capture, fraud-blocked order, invalid state transition</td>
          </tr>
        </tbody>
      </table>

      <h2 id="api-generate">Step 1 — Generate the API Test Scaffold</h2>
      <p>
        Attach the domain-rules file so Copilot generates correct error codes and
        boundary values:
      </p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Supertest',
          language: 'bash',
          code: `Write Supertest tests for the checkout pipeline.
#file:.copilot/context/domain-rules.md
#file:src/app.ts

Cover these routes:
- POST /api/cart/:userId/items — add item, assert 201 + subtotal
- POST /api/discount/apply — valid SAVE10 code, unknown code (BOGUS → INVALID_DISCOUNT_CODE)
- POST /api/fraud/check — high-risk order (amount > $1000, country XX) → approved: false

Use Jest and Supertest. Assert both status code AND response body shape.
Use the error codes from domain-rules.md for error case assertions.`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Write pytest integration tests for the checkout pipeline.
Routes:
- POST /api/cart/{user_id}/items — add item, assert 201 + subtotal
- POST /api/discount/apply — SAVE10 success, BOGUS → INVALID_DISCOUNT_CODE error
- POST /api/fraud/check — high-risk (amount>1000, country=XX) → approved: False

Use the requests library or TestClient. Assert status AND body structure.`,
        },
        {
          label: 'Java / RestAssured',
          language: 'bash',
          code: `Write RestAssured + JUnit 5 integration tests for the checkout pipeline.
Routes: POST /api/cart/{userId}/items, POST /api/discount/apply, POST /api/fraud/check.
Use @MockBean for dependencies. Test success cases, error codes, and fraud blocking.`,
        },
      ]} />

      <h2>Step 2 — Review the Generated Scaffold</h2>
      <Collapsible title="Full generated scaffold" variant="hint">
        <CodeBlock language="typescript">{`// tests/api/checkout.test.ts  (Copilot-generated — review required)
import request from 'supertest';
import { app, resetWorkshopData } from '../../src/app';

const userId = 'user-workshop-01';
let token: string;

beforeEach(async () => {
  await resetWorkshopData();
  // Obtain a seeded auth token for protected routes
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'workshop-password' });
  token = login.body.data.token;
});

describe('Cart', () => {
  it('adds an item and returns the updated subtotal', async () => {
    const res = await request(app)
      .post(\`/api/cart/\${userId}/items\`)
      .set('Authorization', \`Bearer \${token}\`)
      .send({ productId: 'prod-1', price: 25, quantity: 1 });

    expect(res.status).toBe(201);
    expect(res.body.data.subtotal).toBe(25);
  });

  it('merges quantities when the same product is added twice', async () => {
    await request(app)
      .post(\`/api/cart/\${userId}/items\`)
      .set('Authorization', \`Bearer \${token}\`)
      .send({ productId: 'prod-1', price: 25, quantity: 1 });

    const res = await request(app)
      .post(\`/api/cart/\${userId}/items\`)
      .set('Authorization', \`Bearer \${token}\`)
      .send({ productId: 'prod-1', price: 25, quantity: 2 });

    expect(res.status).toBe(201);
    // quantity should be merged to 3, not two separate line items
    const items = res.body.data.items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });
});

describe('Discount', () => {
  it('applies SAVE10 and returns the correct discounted total', async () => {
    const res = await request(app)
      .post('/api/discount/apply')
      .send({ code: 'SAVE10', subtotal: 100 });

    expect(res.status).toBe(200);
    expect(res.body.data.discountAmount).toBe(10);
    expect(res.body.data.finalTotal).toBe(90);
  });

  it('rejects an unknown code with INVALID_DISCOUNT_CODE', async () => {
    const res = await request(app)
      .post('/api/discount/apply')
      .send({ code: 'BOGUS', subtotal: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_DISCOUNT_CODE');
  });
});

describe('Fraud', () => {
  it('blocks a high-risk order (amount > $1000, country XX)', async () => {
    const res = await request(app)
      .post('/api/fraud/check')
      .send({ orderAmount: 10000, itemCount: 50, ipCountry: 'XX' });

    expect(res.status).toBe(200);
    expect(res.body.data.approved).toBe(false);
    expect(res.body.data.riskLevel).toBe('high');
  });

  it('approves a low-risk order', async () => {
    const res = await request(app)
      .post('/api/fraud/check')
      .send({ orderAmount: 50, itemCount: 2, ipCountry: 'DE' });

    expect(res.status).toBe(200);
    expect(res.body.data.approved).toBe(true);
    expect(res.body.data.riskLevel).toBe('low');
  });
});`}</CodeBlock>
      </Collapsible>

      <div className="callout callout-info">
        <strong>🔍 Review checklist for API tests:</strong>
        <ul>
          <li>Does every test assert <em>both</em> status code and response body?</li>
          <li>Do error cases use the exact error codes from <code>domain-rules.md</code> (e.g. <code>INVALID_DISCOUNT_CODE</code>, not <code>NOT_FOUND</code>)?</li>
          <li>Does the fraud test verify <code>riskLevel</code> and <code>approved</code> — not just one field?</li>
          <li>Is the cart merge test asserting <code>items</code> length, not just status?</li>
        </ul>
      </div>

      <h2>Step 3 — Run the API Tests</h2>
      <CodeBlock language="bash">{`npm run test:api`}</CodeBlock>
      <VerifyBlock>{`PASS tests/api/checkout.test.ts
  Cart
    ✓ adds an item and returns the updated subtotal (28 ms)
    ✓ merges quantities when the same product is added twice (22 ms)
  Discount
    ✓ applies SAVE10 and returns the correct discounted total (18 ms)
    ✓ rejects an unknown code with INVALID_DISCOUNT_CODE (12 ms)
  Fraud
    ✓ blocks a high-risk order (amount > $1000, country XX) (15 ms)
    ✓ approves a low-risk order (9 ms)

Tests: 6 passed, 6 total`}</VerifyBlock>

      <h2>Part B — Integration Tests with Real State</h2>
      <p>
        For integration coverage, test that a full checkout flow transitions
        state correctly — items are added, a discount is applied, and the cart
        is cleared after checkout.
      </p>
      <CodeBlock language="bash">{`Write a Jest integration test for the full checkout flow.
#file:.copilot/context/domain-rules.md

Steps:
1. Add item (sku-42) to cart for userId 'user-test-01'
2. Apply discount code SAVE10
3. Call checkout — verify order status is 'confirmed'
4. Verify cart is empty after checkout

Use beforeEach to call db.reset() and seedCatalog() so tests are isolated.`}</CodeBlock>

      <div className="callout callout-info">
        <strong>Starter repo branch</strong> — The integration test helpers (<code>db.reset()</code>,{' '}
        <code>seedCatalog()</code>, <code>addItem()</code>, <code>checkout()</code>) are wired up
        in the <code>solutions</code> branch. Check that out to run these tests locally.
      </div>

      <CodeBlock language="typescript">{`// tests/integration/checkout.int.test.ts
import { db, seedCatalog } from '../../src/db';
import { addItem, applyDiscount, checkout, getCart } from '../../src/services';

const userId = 'user-test-01';

beforeEach(async () => {
  await db.reset();
  await seedCatalog();
});

it('places an order and clears the cart', async () => {
  const cart = await addItem(userId, 'sku-42', { quantity: 1, price: 25 });
  const discounted = await applyDiscount(cart.id, 'SAVE10');

  expect(discounted.discountAmount).toBe(2.5);  // 10% of $25

  const order = await checkout(cart.id);
  expect(order.status).toBe('confirmed');

  const after = await getCart(userId);
  expect(after.items).toHaveLength(0);
});

it('blocks checkout when fraud check fails', async () => {
  const cart = await addItem(userId, 'sku-42', { quantity: 50, price: 250 });

  await expect(checkout(cart.id, { ipCountry: 'XX' }))
    .rejects.toThrow('FRAUD_BLOCKED');
});`}</CodeBlock>

      <div id="api-exercise">
      <TimedExercise minutes={10} title="Hands-on Challenge">
        <p>
          Add coverage for the Payment lifecycle. Use Copilot to generate tests
          for a successful capture and an invalid state transition. Refer to the
          Payment lifecycle in <code>domain-rules.md</code>.
        </p>
        <Collapsible title="Hint: Payment lifecycle rules" variant="hint">
          <ul>
            <li>Valid transitions: <code>pending → captured</code> (POST /api/payment/:id/capture)</li>
            <li>Invalid transition: refunding a <code>pending</code> intent returns <code>INVALID_PAYMENT_STATE</code> with HTTP 409</li>
            <li>Assert the <code>error.code</code> in the error response — not just the status</li>
          </ul>
        </Collapsible>
        <Collapsible title="Full Solution" variant="solution">
          <CodeBlock language="typescript">{`describe('Payment', () => {
  it('captures a pending payment intent', async () => {
    // First create a payment intent via checkout
    const { paymentId } = await setupPendingPayment(userId, token);

    const res = await request(app)
      .post(\`/api/payment/\${paymentId}/capture\`)
      .set('Authorization', \`Bearer \${token}\`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('captured');
  });

  it('rejects refunding a payment that is still pending', async () => {
    const { paymentId } = await setupPendingPayment(userId, token);

    const res = await request(app)
      .post(\`/api/payment/\${paymentId}/refund\`)
      .set('Authorization', \`Bearer \${token}\`);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('INVALID_PAYMENT_STATE');
  });
});`}</CodeBlock>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="api-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Attach <code>domain-rules.md</code> as context — it gives Copilot the exact error codes and boundaries it needs</li>
            <li>Always assert both status code AND body shape — neither alone is sufficient</li>
            <li>Test the checkout pipeline end-to-end: happy path, invalid discount, fraud block, payment lifecycle</li>
            <li>Integration tests should reset and seed state in <code>beforeEach</code> to prevent order-dependent failures</li>
            <li>Speed comes from scaffolding; trust comes from asserting the right domain values</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default ApiIntegration;
