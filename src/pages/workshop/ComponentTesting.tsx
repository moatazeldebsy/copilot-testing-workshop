import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';
import PollBlock from '../../components/PollBlock';
import TimedExercise from '../../components/TimedExercise';

const ComponentTesting: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Exercise D</span>
      <h1>Component Testing with React Testing Library</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        React Testing Library (RTL) tests components the way users interact with
        them — through accessible queries and real events, not internal state. In
        this exercise you will use Copilot to generate RTL tests for{' '}
        <code>StorePage</code>, the product listing and cart entry point in the
        checkout pipeline. Copilot generates RTL tests quickly, but often defaults
        to fragile implementation-detail queries — this step shows how to steer it
        toward accessible, maintainable assertions.
      </p>

      <ExerciseRepoCallout path="/workshop/component-testing" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#component-generate">Jump to generation</a>
        <a href="#component-exercise">Jump to exercise</a>
        <a href="#component-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 7 min RTL strategy and StorePage walkthrough, 6 min generated test review, 7 min refactor challenge and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "In component tests, behavior beats implementation details.
        We will steer Copilot toward accessible queries, mocked fetch, and
        waitFor assertions. If a test only checks internals or class names,
        it is fragile and low value."
      </div>

      <PollBlock
        question="When an RTL test breaks after UI refactoring, what should fail first?"
        options={[
          { emoji: '👥', label: 'Only user-visible behavior assertions' },
          { emoji: '🎨', label: 'CSS class and DOM structure checks' },
          { emoji: '🏷️', label: 'Test IDs and snapshot diffs' },
          { emoji: '🤝', label: 'A balanced mix depending on component role' },
        ]}
        note="Use this poll to frame your query strategy choices in this step."
      />

      <h2 id="component-generate">The RTL Philosophy</h2>
      <div className="callout callout-info">
        <strong>Core principle:</strong> Query elements the way a user (or screen reader) would find them.
        Prefer <code>getByRole</code> → <code>getByLabelText</code> → <code>getByText</code> →
        <code>getByTestId</code> (last resort).
        Avoid querying by CSS class or component internals.
      </div>

      <h2>The Component Under Test — StorePage</h2>
      <p>
        <code>StorePage</code> renders the product catalog, handles "Add to Cart"
        interactions, and shows the current cart. It fetches products from{' '}
        <code>/api/products</code> and posts cart updates to the checkout pipeline.
      </p>
      <CodeBlock language="typescript">{`// src/ui/pages/StorePage.tsx (abbreviated)
// Props the component accepts:
interface StorePageProps {
  userId: string;
  token: string;
}

// What it renders:
// - A product list with one "Add" button per product (data-testid="add-{productId}")
// - A cart section (data-testid="cart-items") showing added item names
// - fetch() is used for both product loading and cart updates`}</CodeBlock>

      <h2 id="component-generate">Step 1 — Generate StorePage Tests with Copilot</h2>
      <p>Select <code>StorePage.tsx</code>, open Copilot Chat, and use this prompt:</p>
      <CodeBlock language="bash">{`Write React Testing Library + Jest tests for StorePage.
#file:src/ui/pages/StorePage.tsx

Props: userId (string), token (string)
The component:
- renders a product list with Add buttons (one per product)
- each Add button has data-testid="add-{productId}"
- clicking Add posts to /api/cart/:userId/items via fetch
- added items appear in data-testid="cart-items"

Mock global.fetch in beforeEach.
Test:
1. Renders at least one Add button
2. Clicking Add shows the item name in cart-items

Use getByRole and getByTestId for queries. Use userEvent.setup().
Use waitFor to await the cart update.`}</CodeBlock>

      <h2>Step 2 — The Factory and Fetch Mock Pattern</h2>
      <p>
        When the generated tests reference test data and fetch mocking, Copilot
        should produce helpers like these. Review them for correct shape.
      </p>
      <CodeBlock language="typescript">{`// tests/factories.ts  (Copilot-generated — matches slide 29)
export const buildCartItem = (overrides = {}) => ({
  id: 'item-1',
  productId: 'prod_1',
  name: 'Workshop T-Shirt',
  price: 25,
  quantity: 1,
  ...overrides,
});

export function mockFetchOnce(body: unknown, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status < 300,
    status,
    json: async () => body,
  });
}`}</CodeBlock>

      <h2>Step 3 — Review the Generated Tests</h2>
      <CodeBlock language="typescript">{`// tests/components/StorePage.test.tsx  (Copilot-generated — review required)
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StorePage } from '../../src/ui/pages/StorePage';
import { buildCartItem, mockFetchOnce } from '../factories';

const props = { userId: 'user-test-01', token: 'test-token' };

describe('StorePage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders products with Add buttons', async () => {
    mockFetchOnce({ data: { products: [{ id: 'prod_1', name: 'Workshop T-Shirt', price: 25 }] } });

    render(<StorePage {...props} />);

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /add/i }).length).toBeGreaterThan(0)
    );
  });

  it('shows item name in cart after clicking Add', async () => {
    const user = userEvent.setup();

    // First fetch: load product list
    mockFetchOnce({ data: { products: [{ id: 'prod_1', name: 'Workshop T-Shirt', price: 25 }] } });
    // Second fetch: cart update response
    mockFetchOnce({ data: { items: [buildCartItem()] } });

    render(<StorePage {...props} />);

    await waitFor(() => screen.getByTestId('add-prod_1'));
    await user.click(screen.getByTestId('add-prod_1'));

    await waitFor(() =>
      expect(screen.getByTestId('cart-items')).toHaveTextContent('Workshop T-Shirt')
    );
  });
});`}</CodeBlock>

      <div className="callout callout-info">
        <strong>🔍 RTL review checklist:</strong>
        <ul>
          <li>Are queries using <code>getByRole</code> or <code>getByTestId</code> rather than CSS classes?</li>
          <li>Is <code>userEvent.setup()</code> called instead of the deprecated direct <code>userEvent.click()</code>?</li>
          <li>Are <code>waitFor</code> assertions used to handle async fetch responses?</li>
          <li>Is <code>global.fetch</code> mocked in <code>beforeEach</code> and reset in <code>afterEach</code>?</li>
          <li>Is the fetch mock order correct? (product list first, then cart update)</li>
        </ul>
      </div>

      <h2>Run the Tests</h2>
      <CodeBlock language="bash">{`npx jest tests/components/StorePage.test.tsx --verbose`}</CodeBlock>
      <VerifyBlock>{`PASS tests/components/StorePage.test.tsx
  StorePage
    ✓ renders products with Add buttons (38 ms)
    ✓ shows item name in cart after clicking Add (54 ms)

Tests: 2 passed, 2 total`}</VerifyBlock>

      <div className="callout callout-info">
        <strong>🎬 Playwright live demo</strong> — The presenter will now run a
        live Playwright E2E test against the checkout flow. This shows the same
        user journey as the RTL tests, but through a real browser navigating from
        StorePage → cart → checkout confirmation.
      </div>

      <div id="component-exercise">
      <TimedExercise minutes={8} title="Hands-on Challenge">
        <p>
          A teammate wrote this StorePage test. Use Copilot to identify the
          problems and generate an improved version:
        </p>
        <CodeBlock language="typescript">{`it('adds item to cart', async () => {
  const { container } = render(<StorePage userId="u1" token="tok" />);

  fireEvent.click(container.querySelector('.add-button'));

  expect(container.querySelector('.cart-items')).toBeTruthy();
});`}</CodeBlock>
        <Collapsible title="Hint: What are the three problems?" variant="hint">
          <ul>
            <li>CSS class selector (<code>.add-button</code>) — fragile, breaks on rename; use <code>getByTestId('add-prod_1')</code></li>
            <li><code>fireEvent</code> instead of <code>userEvent</code> — doesn't simulate real browser pointer events</li>
            <li><code>toBeTruthy()</code> on the element — passes even if cart shows nothing; assert the item <em>name</em> is visible</li>
          </ul>
        </Collapsible>
        <Collapsible title="Fixed Version" variant="solution">
          <CodeBlock language="typescript">{`it('shows item name in cart after clicking Add', async () => {
  const user = userEvent.setup();

  mockFetchOnce({ data: { products: [{ id: 'prod_1', name: 'Workshop T-Shirt', price: 25 }] } });
  mockFetchOnce({ data: { items: [buildCartItem()] } });

  render(<StorePage userId="user-test-01" token="test-token" />);

  await waitFor(() => screen.getByTestId('add-prod_1'));
  await user.click(screen.getByTestId('add-prod_1'));

  await waitFor(() =>
    expect(screen.getByTestId('cart-items')).toHaveTextContent('Workshop T-Shirt')
  );
});`}</CodeBlock>
        </Collapsible>
        <Collapsible title="Bonus: Test empty cart state" variant="bonus">
          <p>
            Add a test that verifies the cart section shows a "Your cart is empty"
            message on initial render before any items are added. Ask Copilot to
            generate it, then check whether it mocks the initial fetch correctly.
          </p>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="component-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Use <code>getByRole</code> and <code>getByTestId</code> — avoid CSS class selectors</li>
            <li>Always use <code>userEvent.setup()</code> — it simulates real pointer and keyboard events</li>
            <li>Mock <code>global.fetch</code> in <code>beforeEach</code>; load responses in order using <code>mockResolvedValueOnce</code></li>
            <li>Assert visible content (item names, text) not just element existence</li>
            <li>Use <code>waitFor</code> for any assertion that depends on async fetch or state update</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default ComponentTesting;
