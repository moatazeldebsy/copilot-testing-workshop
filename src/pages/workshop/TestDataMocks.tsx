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

const TestDataMocks: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 6</span>
      <h1>Test Data &amp; Mock Generation</h1>
      <PageMeta duration="15 min" difficulty="intermediate" />
      <p className="page-lead">
        Test data and mock factories are areas where Copilot shines — they are
        repetitive, type-driven, and rarely contain complex logic. This step
        shows how to generate fixtures and stubs responsibly, including the most
        important guardrail: never letting real-looking sensitive data into your
        codebase.
      </p>

      <ExerciseRepoCallout path="/workshop/test-data-mocks" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#mocks-generate">Jump to generation</a>
        <a href="#mocks-exercise">Jump to exercise</a>
        <a href="#mocks-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 5 min fixture strategy, 5 min mock/stub patterns, 5 min factory challenge and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "Factories and mocks are high-leverage AI territory because they are repetitive.
        We still enforce guardrails: deterministic defaults, override flexibility,
        and zero secrets or realistic PII in fixtures."
      </div>

      <PollBlock
        question="When Copilot generates fixtures, what is your first review priority?"
        options={[
          { emoji: '🔒', label: 'Secret and PII safety' },
          { emoji: '📐', label: 'Type correctness' },
          { emoji: '🧩', label: 'Override flexibility' },
          { emoji: '⚖️', label: 'Realism vs maintainability balance' },
        ]}
        note="There is no single right answer. Use team context and risk level."
      />

      <ArchDiagram
        title="Test Data Strategy"
        nodes={[
          { label: 'Type Definitions', icon: '📐' },
          { label: 'Copilot', icon: '🤖' },
          { label: 'Factory Functions', icon: '🏭' },
          { label: 'Mock Stubs', icon: '🔌' },
          { label: 'Test Files', icon: '🧪' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'context for' },
          { from: 1, to: 2, label: 'generates' },
          { from: 1, to: 3, label: 'generates' },
          { from: 2, to: 4, label: 'used in' },
          { from: 3, to: 4, label: 'used in' },
        ]}
      />

      <h2 id="mocks-generate">Part A — Fixture Factories for the Checkout Pipeline</h2>
      <p>
        A factory function creates test objects with sensible defaults that can
        be overridden per test. Ask Copilot to generate one from your type. Here
        the factories mirror the checkout domain used throughout this workshop:
      </p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'bash',
          code: `Generate TypeScript factory functions for the checkout pipeline types.
#file:src/models/cart.ts
#file:src/models/order.ts

Factories needed:
1. buildCartItem(overrides?) — CartItem with id, productId, name, price, quantity
2. buildOrder(overrides?) — Order with id, userId, items, subtotal, status ('pending'|'confirmed'|'cancelled')

Use obviously fake defaults. Make all fields overridable via a spread parameter.`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Generate Python factory functions for checkout pipeline types.
Factories needed:
1. build_cart_item(**overrides) — dict with id, product_id, name, price, quantity
2. build_order(**overrides) — dict with id, user_id, items, subtotal, status

Use obviously fake defaults. Make all fields overridable via keyword arguments.`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'bash',
          code: `Generate Java builder/factory methods for checkout pipeline types.
Factories needed:
1. CartItemBuilder — id, productId, name, price, quantity with fluent overrides
2. OrderBuilder — id, userId, items, subtotal, status

Use obvious test defaults. Use a fluent builder pattern.`,
        },
      ]} />

      <CodeBlock language="typescript">{`// tests/factories.ts  (Copilot-generated — matches checkout domain)
export const buildCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  productId: 'prod_1',
  name: 'Workshop T-Shirt',
  price: 25,
  quantity: 1,
  ...overrides,
});

export const buildOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-1',
  userId: 'user-test-01',
  items: [buildCartItem()],
  subtotal: 25,
  status: 'pending',
  ...overrides,
});

// Fetch mock helper — used in StorePage component tests
export function mockFetchOnce(body: unknown, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status < 300,
    status,
    json: async () => body,
  });
}

// Usage examples:
// const shirt = buildCartItem({ quantity: 3 });
// const confirmed = buildOrder({ status: 'confirmed', subtotal: 90 });
// mockFetchOnce({ data: { items: [buildCartItem()] } });`}</CodeBlock>

      <div className="callout callout-info">
        <strong>✅ What makes these factories good:</strong>
        <ul>
          <li>Defaults are obviously fake ("Workshop T-Shirt", "user-test-01") — not real-looking PII</li>
          <li>Spread overrides let each test express only what it cares about</li>
          <li><code>mockFetchOnce</code> returns a proper Response-like object including <code>ok</code>, <code>status</code>, and <code>json()</code></li>
        </ul>
      </div>

      <h2>Part B — Mock Service Stubs</h2>
      <p>
        Ask Copilot to generate a complete mock for a service interface. This is
        especially useful for dependency-heavy classes:
      </p>
      <CodeBlock language="bash">{`Generate a Jest mock factory for NotificationService with methods:
sendOrderConfirmation(orderId: string, email: string): Promise<void>
sendShippingUpdate(orderId: string, trackingUrl: string): Promise<void>
All methods should be jest.fn() returning resolved promises.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/mocks/mockNotificationService.ts  (Copilot-generated)
import { NotificationService } from '../../src/services/notificationService';

export const createMockNotificationService = (): jest.Mocked<NotificationService> => ({
  sendOrderConfirmation: jest.fn().mockResolvedValue(undefined),
  sendShippingUpdate: jest.fn().mockResolvedValue(undefined),
});

// Usage:
// const notifService = createMockNotificationService();
// notifService.sendOrderConfirmation.mockRejectedValueOnce(new Error('SMTP failure'));`}</CodeBlock>

      <h2>Part C — Test Data at Scale with Faker</h2>
      <p>
        For tests that need many records (pagination, bulk cart operations), ask
        Copilot to use a fake data library:
      </p>
      <CodeBlock language="bash">{`Generate a function that creates an array of N fake CartItem objects using @faker-js/faker.
Fields: id (uuid), productId (uuid), name (commerce.productName), price (number 1-500), quantity (integer 1-10).
Keep prices and quantities in realistic ranges for a checkout pipeline.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/factories/bulkCartFactory.ts  (Copilot-generated)
import { faker } from '@faker-js/faker';
import { CartItem } from '../../src/models/cart';

export const createCartItems = (count: number): CartItem[] =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    productId: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
    quantity: faker.number.int({ min: 1, max: 10 }),
  }));`}</CodeBlock>

      <h2>Security Guardrail — What to Check</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Risk</th>
            <th>Example</th>
            <th>Safe Alternative</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hardcoded passwords</td>
            <td><code>password: 'Secret123!'</code></td>
            <td><code>password: 'test-password-placeholder'</code></td>
          </tr>
          <tr>
            <td>Real-looking API keys</td>
            <td><code>apiKey: 'sk-abc123xyz...'</code></td>
            <td><code>apiKey: 'test-api-key'</code></td>
          </tr>
          <tr>
            <td>Real email domains</td>
            <td><code>email: 'alice@company.com'</code></td>
            <td><code>email: 'alice@example.com'</code> (RFC 2606 reserved)</td>
          </tr>
          <tr>
            <td>Real-looking PII</td>
            <td><code>ssn: '123-45-6789'</code></td>
            <td>Use <code>faker.string.alphanumeric(9)</code></td>
          </tr>
          <tr>
            <td>JWT tokens</td>
            <td>Full valid signed JWT in a fixture</td>
            <td>Mock the auth middleware; use <code>'test-token'</code></td>
          </tr>
        </tbody>
      </table>

      <div className="callout callout-info">
        <strong>🔒 Add to your <code>.gitleaks.toml</code></strong> — Configure secret scanning
        to catch AI-generated test data that looks like credentials before it reaches your repo.
        Copilot sometimes generates syntactically valid tokens as examples.
      </div>

      <h2>Step — Run a Test Using the Factory</h2>
      <CodeBlock language="typescript">{`// tests/unit/calculateDiscount.test.ts  — using checkout factories
import { buildCartItem, buildOrder } from '../factories';

it('FLAT5 is applied to a confirmed order above the minimum', () => {
  const order = buildOrder({ subtotal: 50, status: 'confirmed' });
  const result = calculateDiscount({ subtotal: order.subtotal, code: 'FLAT5' });

  expect(result.discountAmount).toBe(5);
  expect(result.finalTotal).toBe(45);
});

it('StorePage renders the cart item name after Add', async () => {
  mockFetchOnce({ data: { items: [buildCartItem({ name: 'Workshop T-Shirt' })] } });
  // ... render StorePage and assert
});`}</CodeBlock>
      <VerifyBlock>{`✓ FLAT5 is applied to a confirmed order above the minimum (2 ms)`}</VerifyBlock>

      <div id="mocks-exercise">
      <TimedExercise minutes={6} title="Hands-on Challenge">
        <p>
          The <code>buildOrder</code> factory above does not include a
          <code>discount</code> field. Ask Copilot to extend the factory, then
          review the output for the three most common problems: hardcoded IDs,
          real-looking amounts, and missing override support.
        </p>
        <Collapsible title="Hint: Prompt template" variant="hint">
          <CodeBlock language="bash">{`Extend the buildOrder factory to include an optional discount field:
{ code: string; discountAmount: number; finalTotal: number }
Make it optional (undefined by default).
Do not use real-looking amounts — keep values obviously fake (e.g. 5, 10, 25).`}</CodeBlock>
        </Collapsible>
        <Collapsible title="Bonus: Shared factory index" variant="bonus">
          <p>
            Create a <code>tests/factories/index.ts</code> that re-exports all
            factories. Ask Copilot to generate the barrel file once you have two
            or more factories.
          </p>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="mocks-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Factories with <code>Partial&lt;T&gt;</code> overrides eliminate per-test boilerplate</li>
            <li>Copilot generates good factory stubs from TypeScript types — always review for PII risk</li>
            <li>Never commit real-looking credentials, tokens, or PII — even in test files</li>
            <li>Use <code>example.com</code> (RFC 2606 reserved) for fake email domains</li>
            <li>Configure gitleaks or truffleHog in your CI pipeline to catch secret leaks</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default TestDataMocks;
