import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';
import PollBlock from '../../components/PollBlock';
import TimedExercise from '../../components/TimedExercise';

const E2EPlaywright: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Exercise D</span>
      <h1>E2E Testing with Playwright</h1>
      <PageMeta duration="25 min" difficulty="intermediate" />
      <p className="page-lead">
        Playwright is the modern standard for end-to-end browser testing.
        Copilot can generate page objects, locator strategies, and test fixtures
        — but it cannot see your actual UI. This step shows how to give Copilot
        the context it needs to produce useful E2E test scaffolding.
      </p>

      <ExerciseRepoCallout path="/workshop/e2e-playwright" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#e2e-generate">Jump to generation</a>
        <a href="#e2e-exercise">Jump to exercise</a>
        <a href="#e2e-debrief">Jump to debrief</a>
      </div>

      <PollBlock
        question="Which locator strategy do you trust most for long-term E2E test stability?"
        options={[
          { emoji: '♿', label: 'ARIA-first (getByRole/getByLabel)' },
          { emoji: '🏷️', label: 'Data attributes only' },
          { emoji: '🎨', label: 'CSS selectors for speed' },
          { emoji: '🧭', label: 'Case-by-case blend' },
        ]}
        note="Compare your choice to the page-object refactor challenge at the end."
      />

      <ArchDiagram
        title="E2E Test Architecture"
        nodes={[
          { label: 'Test File', icon: '🧪' },
          { label: 'Page Object', icon: '📄' },
          { label: 'Playwright Browser', icon: '🌐' },
          { label: 'Running App', icon: '🖥️' },
          { label: 'API / DB', icon: '🗄️' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'uses' },
          { from: 1, to: 2, label: 'controls' },
          { from: 2, to: 3, label: 'HTTP' },
          { from: 3, to: 4 },
        ]}
      />

      <h2 id="e2e-generate">Part A — Page Object Model with Copilot</h2>
      <p>
        The Page Object Model (POM) keeps locators out of your tests. Copilot
        generates the boilerplate well; you provide the real selector knowledge.
      </p>

      <div className="callout callout-warning">
        <strong>⚠️ This app auto-logs-in on first load</strong> — <code>WorkshopApp.tsx</code>{' '}
        automatically signs in as <code>alice@example.com</code> if no token is stored and the
        user hasn't explicitly signed out. Clear <code>localStorage</code> (or set{' '}
        <code>workshop-signed-out=true</code>) at the start of any test that needs to see the
        login form — otherwise the app may skip straight to <code>/store</code>.
      </div>

      <h2>Step 1 — Generate a Login Page Object</h2>
      <p>Use this prompt in Copilot Chat:</p>
      <CodeBlock language="bash">{`Generate a Playwright Page Object for a login page.
The page has: an email input (#email), a password input (#password),
a submit button (role=button, name="Sign in"), and an error alert (.error-message).
Use TypeScript. Include: fill(), submit(), getErrorMessage(), and waitForStore() methods.`}</CodeBlock>

      <h2>Step 2 — Review the Generated Page Object</h2>
      <CodeBlock language="typescript">{`// tests/e2e/pages/LoginPage.ts  (Copilot-generated — review required)
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fill(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.innerText();
  }

  async waitForStore() {
    await this.page.waitForURL('/store');
  }
}`}</CodeBlock>

      <div className="callout callout-info">
        <strong>🔍 Page Object review checklist:</strong>
        <ul>
          <li>Do selectors use <code>getByRole</code> / <code>getByLabel</code> before falling back to CSS classes?</li>
          <li>Are role-based locators used where possible (more resilient to UI changes)?</li>
          <li>Does <code>waitForStore()</code> use URL assertion rather than an arbitrary wait?</li>
          <li>Are locators declared as <code>readonly</code> to prevent accidental reassignment?</li>
        </ul>
      </div>

      <h2>Step 3 — Generate E2E Tests Using the Page Object</h2>
      <CodeBlock language="bash">{`Write Playwright tests for the login flow using the LoginPage page object.
Test: successful login redirects to /store, wrong password shows error,
empty email also shows an error (there is no client-side required-field validation —
submitting blank calls the login API and it responds with an error).
Use @playwright/test. Use test.beforeEach to clear localStorage, then navigate to /login.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/e2e/login.spec.ts  (Copilot-generated — review required)
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Prevent the app's auto-login from skipping past the login form
    await page.addInitScript(() => {
      window.localStorage.setItem('workshop-signed-out', 'true');
    });

    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login redirects to the store', async ({ page }) => {
    await loginPage.fill('alice@example.com', 'workshop-password');
    await loginPage.submit();
    await loginPage.waitForStore();

    await expect(page).toHaveURL('/store');
  });

  test('wrong password shows error message', async () => {
    await loginPage.fill('alice@example.com', 'wrong-password');
    await loginPage.submit();

    const error = await loginPage.getErrorMessage();
    expect(error).toMatch(/invalid credentials/i);
  });

  test('empty email shows an error', async () => {
    // No client-side required-field validation exists — submitting blank
    // still calls the login API, which rejects it.
    await loginPage.fill('', 'some-password');
    await loginPage.submit();

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });
});`}</CodeBlock>

      <h2>Part B — Playwright MCP Server Example</h2>
      <p>
        When selector details are unclear, the <strong>Playwright MCP Server</strong>
        gives Copilot live browser context instead of forcing it to guess from
        code alone. This is useful when you want Copilot to inspect the running
        page, interact with the UI, and capture evidence before generating or
        repairing tests.
      </p>

      <h3>Step 0 — Install and enable the MCP server</h3>
      <p>
        This repo already ships <code>.vscode/mcp.json</code>, pointing at{' '}
        <code>npx @playwright/mcp@latest</code> — <code>npx</code> downloads it on first run,
        so no separate <code>npm install</code> is needed. You do need to turn it on in your editor:
      </p>
      <ol>
        <li>Open Copilot Chat and switch to <strong>Agent mode</strong> (MCP tools are only available there, not in Ask/Edit mode)</li>
        <li>VS Code should detect <code>.vscode/mcp.json</code> and prompt to start the <code>playwright</code> server —
          click <strong>Start</strong> (or run <em>MCP: List Servers</em> from the Command Palette and start it manually)</li>
        <li>Confirm it's live: the Chat tool picker (🔧 icon) should now list Playwright tools
          (<code>browser_navigate</code>, <code>browser_click</code>, <code>browser_snapshot</code>, etc.)</li>
        <li>Make sure the app is actually running (<code>npm run dev</code>) — the MCP server drives a
          real browser against <code>http://127.0.0.1:3006</code>, it doesn't read your source code</li>
      </ol>
      <div className="callout callout-info">
        First launch can take a few seconds while <code>npx</code> downloads the package — if the tool
        picker looks empty right after starting, wait a moment and reopen it.
      </div>

      <CodeBlock language="text">{`Using the Playwright MCP server, open the login page in the running app.
Inspect the form fields and submit button, then click Sign in with invalid credentials.
Tell me:
1. the best role- or label-based locators for email, password, submit, and error states
2. whether the validation error is exposed as an alert, inline text, or field description
3. take a screenshot after the failed login so I can confirm the UI state`}</CodeBlock>

      <div className="callout callout-info">
        <strong>Why this matters</strong>
        MCP browser automation lets Copilot navigate, click, and screenshot the
        real page. That is much better than inventing selectors from memory,
        especially for flaky E2E failures or accessibility-driven locator reviews.
      </div>

      <h2>Part C — Fixtures and Test Isolation</h2>
      <p>
        Playwright's fixture system lets Copilot generate test-scoped setup and
        teardown. Ask for an authenticated fixture to avoid repeating login steps:
      </p>
      <CodeBlock language="bash">{`Create a Playwright fixture called 'authenticatedPage' that logs in as a test user
before each test and provides the authenticated page object.
The login API endpoint is POST /api/auth/login with { email, password } body.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/e2e/fixtures.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type AuthFixtures = {
  authenticatedPage: ReturnType<typeof base.extend>['page'];
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Log in via API to avoid UI login overhead in every test
    const response = await page.request.post('/api/auth/login', {
      data: { email: 'alice@example.com', password: 'workshop-password' },
    });
    expect(response.status()).toBe(200);

    const { data } = await response.json();
    await page.addInitScript((t) => {
      localStorage.setItem('workshop-auth-token', t);
    }, data.token);

    await use(page);
  },
});

export { expect } from '@playwright/test';`}</CodeBlock>

      <div className="callout callout-warning">
        <strong>⚠️ Security review:</strong>
        <ul>
          <li>Never hardcode test passwords — use <code>process.env.TEST_PASSWORD</code></li>
          <li>Ensure <code>.env.test</code> is in <code>.gitignore</code></li>
          <li>Use a dedicated test user account — never credentials for real users</li>
          <li>Token storage via <code>addInitScript</code> is safe; avoid storing in test output or logs</li>
        </ul>
      </div>

      <h2>Part D — CI Integration</h2>
      <p>Ask Copilot to generate a GitHub Actions workflow for Playwright:</p>
      <CodeBlock language="bash">{`Generate a GitHub Actions workflow that runs Playwright E2E tests on pull requests.
Include: install dependencies, build the app, start the server in the background,
run playwright tests, upload the HTML report as an artifact on failure.`}</CodeBlock>

      <CodeBlock language="yaml">{`# .github/workflows/e2e.yml  (Copilot-generated — review required)
name: E2E Tests

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22.12'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Start API and web dev servers
        # This app is a live Express API + React frontend, not a static
        # build — E2E tests need both servers running, matching local dev.
        run: npm run dev &

      - name: Wait for servers to be ready
        run: npx wait-on http://127.0.0.1:3006 http://127.0.0.1:4000/api/health

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload test report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/`}</CodeBlock>

      <VerifyBlock>{`Running 3 tests using 1 worker

  ✓ login.spec.ts:14:3 › Login flow › successful login redirects to the store (1.2s)
  ✓ login.spec.ts:22:3 › Login flow › wrong password shows error message (0.8s)
  ✓ login.spec.ts:29:3 › Login flow › empty email shows an error (0.6s)

  3 passed (3.2s)`}</VerifyBlock>

      <h2>Part E — The Real Exercise: Checkout Flow</h2>
      <p>
        <code>tests/e2e/checkout.spec.ts</code> has four <code>test.fixme</code> placeholders
        covering the full store journey — login, add to cart, apply a discount, and complete
        checkout. Use this prompt in Copilot Chat:
      </p>
      <CodeBlock language="bash">{`Fill in the test.fixme placeholders in tests/e2e/checkout.spec.ts using Playwright.

Context files:
- #file:tests/e2e/checkout.spec.ts
- #file:src/ui/pages/LoginPage.tsx
- #file:src/ui/pages/StorePage.tsx

Important app behavior:
- The app auto-logs-in as alice@example.com on first load unless localStorage
  has workshop-signed-out=true or a token already set. Set workshop-signed-out=true
  via page.addInitScript in beforeEach so tests reliably see the login form.
- Login: #email, #password inputs, button role "Sign in", error shown via role="alert".
  Successful login navigates to /store (not /dashboard).
- StorePage: Add buttons have data-testid="add-{productId}", cart shows in
  data-testid="cart-items", promo input has placeholder "e.g. SAVE10", total is
  data-testid="checkout-total", pay button is data-testid="pay-btn".
- Login credentials: alice@example.com / workshop-password.

Implement, in order:
1. user can log in and see the store — login, assert redirect to /store, assert product grid
   visible
2. user can add an item to the cart — login, click an Add button, assert cart-items updates
3. user can apply a discount code — login, add item, enter SAVE10, click Apply, assert total
   decreases
4. user completes checkout and sees confirmation — full golden path: login → add to cart →
   pay → confirmation screen

Replace test.fixme with test. Use getByRole/getByTestId locators, not CSS classes.`}</CodeBlock>
      <p>Then run:</p>
      <CodeBlock language="bash">{`npx playwright test tests/e2e/checkout.spec.ts
npm run test:e2e`}</CodeBlock>
      <VerifyBlock>{`Running 4 tests using 1 worker

  ✓ checkout.spec.ts:19:3 › Store checkout flow › user can log in and see the store (249ms)
  ✓ checkout.spec.ts:30:3 › Store checkout flow › user can add an item to the cart (268ms)
  ✓ checkout.spec.ts:39:3 › Store checkout flow › user can apply a discount code (389ms)
  ✓ checkout.spec.ts:57:3 › Store checkout flow › user completes checkout and sees confirmation (305ms)

  4 passed (1.8s)`}</VerifyBlock>
      <div className="callout callout-info">
        <strong>🔍 Two things Copilot's first draft commonly gets wrong here:</strong>
        <ul>
          <li>Forgetting the <code>workshop-signed-out</code> localStorage flag — without it, the
            app's auto-login races the test past the login form entirely</li>
          <li>Reading UI state (like <code>checkout-total</code>) immediately after a click that
            triggers an async update — use <code>expect.poll(...)</code> or an auto-retrying{' '}
            <code>expect(locator)</code> assertion instead of a one-shot read-and-compare</li>
        </ul>
      </div>

      <div id="e2e-exercise">
      <TimedExercise minutes={10} title="Hands-on Challenge">
        <p>
          The test above uses CSS class <code>.error-message</code> as a locator.
          Use Copilot to refactor the <code>LoginPage</code> to use ARIA-based
          locators instead, then verify the tests still pass.
        </p>
        <Collapsible title="Hint: Which Playwright locator to use?" variant="hint">
          <ul>
            <li>Consider <code>page.getByRole('alert')</code> for error messages — it's accessible and resilient</li>
            <li>Use <code>page.getByLabel('Email')</code> and <code>page.getByLabel('Password')</code> for form inputs</li>
            <li>Role-based locators break only if ARIA semantics change, not on CSS refactors</li>
          </ul>
        </Collapsible>
        <Collapsible title="Refactored Solution" variant="solution">
          <CodeBlock language="typescript">{`constructor(page: Page) {
  this.page = page;
  this.emailInput = page.getByLabel('Email');
  this.passwordInput = page.getByLabel('Password');
  this.submitButton = page.getByRole('button', { name: 'Sign in' });
  this.errorMessage = page.getByRole('alert');
}`}</CodeBlock>
        </Collapsible>
      </TimedExercise>

      <TimedExercise minutes={15} title="Bonus: Put It All Together">
        <p>
          Parts B, C, and D show patterns (MCP-assisted locator discovery, fixtures,
          CI) without you actually using them. Pick up all three here — optional,
          time-permitting.
        </p>

        <h3>1. Use the Playwright MCP server for real</h3>
        <p>
          The Playwright MCP server is already configured in <code>.vscode/mcp.json</code>.
          Run Part B's prompt against the real login page (<code>http://127.0.0.1:3006/login</code>)
          instead of just reading it. Report back what Copilot finds.
        </p>
        <Collapsible title="Hint: What to check your results against" variant="hint">
          <ul>
            <li>Locators should match <code>LoginPage.tsx</code>: <code>#email</code>, <code>#password</code>,
              a submit button named "Sign in"</li>
            <li>The error is rendered as <code>&lt;div role="alert"&gt;</code> — confirm Copilot identifies
              it as an alert, not a generic <code>.error-message</code> class</li>
            <li>Compare the screenshot Copilot captures against what you see manually in the browser</li>
          </ul>
        </Collapsible>

        <h3>2. Create the fixture and actually use it</h3>
        <p>
          Create <code>tests/e2e/fixtures.ts</code> using Part C's corrected pattern, then refactor
          one test in <code>checkout.spec.ts</code> to use <code>authenticatedPage</code> instead of
          calling <code>loginAsAlice(page)</code>.
        </p>
        <Collapsible title="Hint: What changes in the test" variant="hint">
          <ul>
            <li>Import <code>test</code> and <code>expect</code> from your new <code>fixtures.ts</code>{' '}
              instead of <code>@playwright/test</code></li>
            <li>Replace the test's <code>page</code> fixture parameter with <code>authenticatedPage</code></li>
            <li>Delete the now-unneeded <code>loginAsAlice(page)</code> call at the top of that test</li>
            <li>Run it — should still pass, just skip the UI login round-trip</li>
          </ul>
        </Collapsible>

        <h3>3. Find one more issue in the CI workflow</h3>
        <p>
          Part D's workflow is now fixed to start real dev servers and wait for them —
          but it still has at least one gap. Find it.
        </p>
        <Collapsible title="Hint" variant="hint">
          <ul>
            <li>What happens to the <code>npm run dev &amp;</code> background process and the two dev
              servers when the job ends — is anything explicitly cleaned up?</li>
            <li>Is the Playwright HTML report uploaded on <em>every</em> run, or only on failure — would
              you want to see it on a passing run too sometimes?</li>
          </ul>
        </Collapsible>
        <Collapsible title="One reasonable answer" variant="solution">
          <p>
            Background jobs are killed automatically when the runner's VM is torn down at the end of
            the job, so explicit cleanup isn't required in GitHub Actions — but it's worth calling out
            in review since it would matter in a longer-lived environment (e.g. a self-hosted runner).
            For the report: uploading only <code>if: failure()</code> is a reasonable default to keep
            artifact storage down, but change it to <code>if: always()</code> if you also want traces
            from flaky-but-passing runs.
          </p>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="e2e-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Copilot generates POM boilerplate well — you supply the real selectors</li>
            <li>Prefer role-based locators (<code>getByRole</code>, <code>getByLabel</code>) over CSS classes</li>
            <li>Use Playwright fixtures for shared setup; avoid repeating login in every test</li>
            <li>Never hardcode credentials — use environment variables and test-only accounts</li>
            <li>Upload Playwright HTML reports as CI artifacts to diagnose failures quickly</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default E2EPlaywright;
