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

      <h2>Step 1 — Generate a Login Page Object</h2>
      <p>Use this prompt in Copilot Chat:</p>
      <CodeBlock language="bash">{`Generate a Playwright Page Object for a login page.
The page has: an email input (#email), a password input (#password),
a submit button (role=button, name="Sign in"), and an error alert (.error-message).
Use TypeScript. Include: fill(), submit(), getErrorMessage(), and waitForDashboard() methods.`}</CodeBlock>

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

  async waitForDashboard() {
    await this.page.waitForURL('/dashboard');
  }
}`}</CodeBlock>

      <div className="callout callout-info">
        <strong>🔍 Page Object review checklist:</strong>
        <ul>
          <li>Do selectors use <code>getByRole</code> / <code>getByLabel</code> before falling back to CSS classes?</li>
          <li>Are role-based locators used where possible (more resilient to UI changes)?</li>
          <li>Does <code>waitForDashboard()</code> use URL assertion rather than an arbitrary wait?</li>
          <li>Are locators declared as <code>readonly</code> to prevent accidental reassignment?</li>
        </ul>
      </div>

      <h2>Step 3 — Generate E2E Tests Using the Page Object</h2>
      <CodeBlock language="bash">{`Write Playwright tests for the login flow using the LoginPage page object.
Test: successful login redirects to /dashboard, wrong password shows error,
empty email shows validation message.
Use @playwright/test. Use test.beforeEach to navigate to /login.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/e2e/login.spec.ts  (Copilot-generated — review required)
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await loginPage.fill('alice@example.com', 'correct-password');
    await loginPage.submit();
    await loginPage.waitForDashboard();

    await expect(page).toHaveURL('/dashboard');
  });

  test('wrong password shows error message', async () => {
    await loginPage.fill('alice@example.com', 'wrong-password');
    await loginPage.submit();

    const error = await loginPage.getErrorMessage();
    expect(error).toMatch(/invalid credentials/i);
  });

  test('empty email shows validation', async ({ page }) => {
    await loginPage.fill('', 'some-password');
    await loginPage.submit();

    await expect(page.locator('#email')).toBeFocused();
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
      data: { email: 'test@example.com', password: process.env.TEST_PASSWORD },
    });
    expect(response.status()).toBe(200);

    const { token } = await response.json();
    await page.addInitScript((t) => {
      localStorage.setItem('auth_token', t);
    }, token);

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
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Build app
        run: npm run build

      - name: Start preview server
        run: npx serve dist -p 4173 &

      - name: Run E2E tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:4173
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}

      - name: Upload test report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/`}</CodeBlock>

      <VerifyBlock>{`Running 3 tests using 1 worker

  ✓ login.spec.ts:11:3 › Login flow › successful login redirects to dashboard (1.2s)
  ✓ login.spec.ts:19:3 › Login flow › wrong password shows error message (0.8s)
  ✓ login.spec.ts:26:3 › Login flow › empty email shows validation (0.6s)

  3 passed (3.2s)`}</VerifyBlock>

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
