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

      <h2 id="mocks-generate">Part A — Fixture Factories</h2>
      <p>
        A factory function creates test objects with sensible defaults that can
        be overridden per test. Ask Copilot to generate one from your type:
      </p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'bash',
          code: `Generate a TypeScript factory function for this User type:
{ id: string; name: string; email: string; role: 'admin' | 'user'; createdAt: Date }
Use crypto.randomUUID() for id. Make all fields overridable via a Partial<User> parameter.`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Generate a Python factory function for a User dataclass:
@dataclass User: id: str, name: str, email: str, role: Literal['admin', 'user'], created_at: datetime
Use uuid.uuid4() for id. Make all fields overridable via keyword arguments with defaults.`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'bash',
          code: `Generate a Java builder/factory for a User record:
record User(String id, String name, String email, Role role, Instant createdAt)
Use UUID.randomUUID() for id. Make all fields overridable via a fluent builder pattern.`,
        },
      ]} />

      <CodeBlock language="typescript">{`// tests/factories/userFactory.ts  (Copilot-generated)
import { User } from '../../src/models/user';

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: crypto.randomUUID(),
  name: 'Test User',
  email: \`user-\${Date.now()}@example.com\`,
  role: 'user',
  createdAt: new Date(),
  ...overrides,
});

// Usage in tests:
// const admin = createUser({ role: 'admin', name: 'Admin Alice' });
// const existing = createUser({ email: 'known@example.com' });`}</CodeBlock>

      <div className="callout callout-info">
        <strong>✅ What makes this factory good:</strong>
        <ul>
          <li>Uses <code>Date.now()</code> in the email to avoid duplicate-key errors in integration tests</li>
          <li>Defaults are realistic but obviously fake (e.g. <code>example.com</code>)</li>
          <li><code>Partial&lt;User&gt;</code> spread allows per-test overrides without boilerplate</li>
        </ul>
      </div>

      <h2>Part B — Mock Service Stubs</h2>
      <p>
        Ask Copilot to generate a complete mock for a service interface. This is
        especially useful for dependency-heavy classes:
      </p>
      <CodeBlock language="bash">{`Generate a Jest mock factory for EmailService with methods:
sendWelcome(email: string): Promise<void>
sendPasswordReset(email: string, token: string): Promise<void>
All methods should be jest.fn() returning resolved promises.`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/mocks/mockEmailService.ts  (Copilot-generated)
import { EmailService } from '../../src/services/emailService';

export const createMockEmailService = (): jest.Mocked<EmailService> => ({
  sendWelcome: jest.fn().mockResolvedValue(undefined),
  sendPasswordReset: jest.fn().mockResolvedValue(undefined),
});

// Usage:
// const emailService = createMockEmailService();
// emailService.sendWelcome.mockRejectedValueOnce(new Error('SMTP failure'));`}</CodeBlock>

      <h2>Part C — Test Data at Scale with Faker</h2>
      <p>
        For tests that need many records (performance, pagination, bulk
        operations), ask Copilot to use a fake data library:
      </p>
      <CodeBlock language="bash">{`Generate a function that creates an array of N fake User objects using @faker-js/faker.
Fields: id (uuid), name (fullName), email (internet.email), role (random admin/user), createdAt (past date).`}</CodeBlock>

      <CodeBlock language="typescript">{`// tests/factories/bulkUserFactory.ts  (Copilot-generated)
import { faker } from '@faker-js/faker';
import { User } from '../../src/models/user';

export const createUsers = (count: number): User[] =>
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'user'] as const),
    createdAt: faker.date.past(),
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
      <CodeBlock language="typescript">{`// tests/unit/userService.test.ts  — using the factory
import { createUser } from '../factories/userFactory';

it('should throw if email already exists', async () => {
  const existing = createUser({ email: 'taken@example.com' });
  mockRepo.findByEmail.mockResolvedValue(existing);

  await expect(userService.createUser({ name: 'Bob', email: 'taken@example.com' }))
    .rejects.toThrow('Email already registered');
});`}</CodeBlock>
      <VerifyBlock>{`✓ should throw if email already exists (2 ms)`}</VerifyBlock>

      <div id="mocks-exercise">
      <TimedExercise minutes={6} title="Hands-on Challenge">
        <p>
          Ask Copilot to generate a factory for the <code>Order</code> type in
          the starter repo. Then review the output for the three most common
          problems: hardcoded IDs, real-looking amounts, and missing override
          support.
        </p>
        <Collapsible title="Hint: Prompt template" variant="hint">
          <CodeBlock language="bash">{`Generate a TypeScript factory for the Order type.
Include: id (uuid), userId (string), items (array of OrderItem), total (number), status ('pending'|'complete'|'cancelled'), createdAt (Date).
Make all fields overridable via Partial<Order>.
Use obviously fake values (not real-looking IDs or amounts).`}</CodeBlock>
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
