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
      <span className="step-badge">Step 10</span>
      <h1>Component Testing with React Testing Library</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        React Testing Library (RTL) tests components the way users interact with
        them — through accessible queries and real events, not internal state.
        Copilot generates RTL tests quickly, but often defaults to fragile
        implementation-detail queries. This step shows how to guide it toward
        accessible, maintainable tests.
      </p>

      <ExerciseRepoCallout path="/workshop/component-testing" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#component-generate">Jump to generation</a>
        <a href="#component-exercise">Jump to exercise</a>
        <a href="#component-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 7 min RTL strategy, 6 min hook/context patterns, 7 min refactor challenge and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "In component tests, behavior beats implementation details.
        We will steer Copilot toward accessible queries and user-event interactions.
        If a test only checks internals, it is likely fragile and low value."
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

      <h2>Part A — Testing a Form Component</h2>
      <p>
        Ask Copilot to generate tests for a registration form component.
        Provide the component's interface so Copilot can generate accurate assertions:
      </p>
      <CodeBlock language="bash">{`Generate React Testing Library + Jest tests for a RegistrationForm component.
Props: onSubmit(data: { name: string; email: string; role: 'admin' | 'viewer' }) => void
The form has: Name input (label "Full Name"), email input (label "Email"),
a select dropdown (label "Role"), and a Submit button.
Test: renders all fields, submits correct data, shows validation when name is empty,
disables submit while loading (prop: isLoading).`}</CodeBlock>

      <h2>Step 1 — Review the Generated Tests</h2>
      <CodeBlock language="typescript">{`// tests/components/RegistrationForm.test.tsx  (Copilot-generated — review required)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '../../src/components/RegistrationForm';

describe('RegistrationForm', () => {
  it('renders all form fields', () => {
    render(<RegistrationForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is filled', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<RegistrationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full Name'), 'Alice Smith');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.selectOptions(screen.getByLabelText('Role'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice Smith',
      email: 'alice@example.com',
      role: 'admin',
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup();

    render(<RegistrationForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/name is required/i);
  });

  it('disables submit button while loading', () => {
    render(<RegistrationForm onSubmit={jest.fn()} isLoading />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});`}</CodeBlock>

      <div className="callout callout-info">
        <strong>🔍 RTL review checklist:</strong>
        <ul>
          <li>Are queries using <code>getByRole</code> or <code>getByLabelText</code> rather than CSS classes or test IDs?</li>
          <li>Is <code>userEvent.setup()</code> called instead of the deprecated <code>userEvent.type()</code> directly?</li>
          <li>Does the submit test assert <em>what</em> was called, not just <em>that</em> it was called?</li>
          <li>Is the validation test checking a visible <code>alert</code> role — not internal state?</li>
        </ul>
      </div>

      <h2>Part B — Mocking Hooks and Context</h2>
      <p>
        When a component depends on a custom hook or React context, Copilot
        needs explicit guidance on how to mock them. Use this pattern:
      </p>
      <CodeBlock language="bash">{`Generate RTL tests for a UserProfile component that:
- reads from useCurrentUser() hook (returns { name, email, role })
- calls logout() from useAuth() hook on button click
Mock both hooks with jest.mock(). Test: renders user data, calls logout on click.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/components/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../../src/components/UserProfile';

// Mock hooks at the module level
jest.mock('../../src/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'admin',
  }),
}));

const mockLogout = jest.fn();
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

describe('UserProfile', () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it('renders user name and email', () => {
    render(<UserProfile />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserProfile />);

    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});`}</CodeBlock>

      <h2>Part C — Testing Context Providers</h2>
      <p>
        For components that consume React Context, create a helper wrapper
        rather than wrapping every test manually:
      </p>
      <CodeBlock language="bash">{`Generate a renderWithProviders() test utility that wraps components in:
- ThemeContext (default theme: 'light')
- AuthContext (default user: { id: '1', role: 'viewer' })
Use React Testing Library's render() options.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/utils/renderWithProviders.tsx
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { AuthProvider } from '../../src/context/AuthContext';

const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider defaultTheme="light">
    <AuthProvider defaultUser={{ id: '1', role: 'viewer' }}>
      {children}
    </AuthProvider>
  </ThemeProvider>
);

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}`}</CodeBlock>

      <VerifyBlock>{`PASS tests/components/RegistrationForm.test.tsx
  RegistrationForm
    ✓ renders all form fields (22 ms)
    ✓ calls onSubmit with correct data when form is filled (48 ms)
    ✓ shows validation error when name is empty (31 ms)
    ✓ disables submit button while loading (8 ms)

PASS tests/components/UserProfile.test.tsx
  UserProfile
    ✓ renders user name and email (12 ms)
    ✓ calls logout when logout button is clicked (19 ms)

Tests: 6 passed, 6 total`}</VerifyBlock>

      <div id="component-exercise">
      <TimedExercise minutes={8} title="Hands-on Challenge">
        <p>
          A teammate wrote this test. Use Copilot to identify the problem and
          generate an improved version:
        </p>
        <CodeBlock language="typescript">{`it('submits the form', async () => {
  const onSubmit = jest.fn();
  const { container } = render(<RegistrationForm onSubmit={onSubmit} />);

  fireEvent.change(container.querySelector('.name-input'), { target: { value: 'Alice' } });
  fireEvent.click(container.querySelector('button[type="submit"]'));

  expect(onSubmit).toBeTruthy();
});`}</CodeBlock>
        <Collapsible title="Hint: What are the three problems?" variant="hint">
          <ul>
            <li>CSS class selector (<code>.name-input</code>) — fragile, breaks on rename</li>
            <li><code>fireEvent</code> instead of <code>userEvent</code> — doesn't simulate real browser events</li>
            <li><code>expect(onSubmit).toBeTruthy()</code> — always passes; doesn't verify it was actually called</li>
          </ul>
        </Collapsible>
        <Collapsible title="Fixed Version" variant="solution">
          <CodeBlock language="typescript">{`it('submits the form', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();

  render(<RegistrationForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Full Name'), 'Alice');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice' }));
});`}</CodeBlock>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="component-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>RTL favors user-facing queries (<code>getByRole</code>, <code>getByLabelText</code>) over CSS or test IDs</li>
            <li>Always use <code>userEvent.setup()</code> — it simulates real pointer and keyboard events</li>
            <li>Check <em>what</em> functions are called with, not just <em>that</em> they were called</li>
            <li>Mock hooks at the module level; clear mocks in <code>beforeEach</code> to prevent test leakage</li>
            <li>Extract <code>renderWithProviders</code> to avoid wrapping context in every single test</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default ComponentTesting;
