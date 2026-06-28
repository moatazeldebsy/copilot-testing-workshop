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
      <span className="step-badge">Step 5</span>
      <h1>API &amp; Integration Tests</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        Copilot is effective at scaffolding REST API tests and integration test
        structure — but it cannot know your specific routes, status codes, or
        data contracts. This step shows how to use Copilot to generate the
        skeleton and then fill in the knowledge Copilot lacks.
      </p>

      <ExerciseRepoCallout path="/workshop/api-integration" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#api-generate">Jump to generation</a>
        <a href="#api-exercise">Jump to exercise</a>
        <a href="#api-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 6 min route-contract generation, 7 min scaffold review and fixes, 7 min hands-on challenge.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "Copilot can scaffold API tests fast, but only you know your real contract.
        We will validate status, body shape, and auth boundaries explicitly.
        Speed comes from scaffolding; trust comes from contract assertions."
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
            rationale: 'Use this step to start with route tests first, then add one integration path for confidence in repository behavior.',
          },
        ]}
        note="Pick a strategy, reveal rationale, then align your first implementation slice with the recommendation."
      />

      <ArchDiagram
        title="API Test Architecture"
        nodes={[
          { label: 'Test File', icon: '🧪' },
          { label: 'Supertest', icon: '📡' },
          { label: 'Express App', icon: '🔌' },
          { label: 'Service Layer', icon: '⚙️' },
          { label: 'Mock DB / Real DB', icon: '🗄️' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'uses' },
          { from: 1, to: 2, label: 'HTTP request' },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
        ]}
      />

      <h2>Part A — REST API Tests with Supertest</h2>
      <p>
        Supertest lets you test Express routes without starting a real server.
        Copilot knows this pattern well.
      </p>

      <h2 id="api-generate">Step 1 — Generate the API Test Scaffold</h2>
      <p>Open Copilot Chat and use this prompt (adjust for your actual routes):</p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Supertest',
          language: 'bash',
            code: `Write Supertest tests for an Express app with auth-aware routes.
  Routes:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/users/:id (requires Bearer token)
  - DELETE /api/users/:id (requires Bearer token)
  Response contract:
  - success payloads in { data: ... }
  - errors in { error: { code, message } }
  Use Jest and include tests for happy path, unauthorized requests, and duplicate email registration.`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Write pytest integration tests for a Flask/FastAPI router at /api/users.
Routes: POST /api/users (create), GET /api/users/{id} (fetch), DELETE /api/users/{id} (delete).
Use the requests library or TestClient. Mock the UserService. Test: success, 404, 422 validation errors.`,
        },
        {
          label: 'Java / RestAssured',
          language: 'bash',
          code: `Write RestAssured + JUnit 5 integration tests for a Spring Boot controller at /api/users.
Routes: POST /api/users (create), GET /api/users/{id} (fetch), DELETE /api/users/{id} (delete).
Mock the UserService with @MockBean. Test: success cases, 404 errors, 400 validation errors.`,
        },
      ]} />

        <h2>Step 2 — Review the Generated Scaffold</h2>
        <Collapsible title="Full generated scaffold" variant="hint">
          <CodeBlock language="typescript">{`// tests/api/auth-and-users.test.ts  (Copilot-generated — review required)
import request from 'supertest';
    import { app, resetWorkshopData } from '../../src/app';

    describe('Auth and user API', () => {
      beforeEach(async () => {
        await resetWorkshopData();
      });

      it('registers a user and returns token + public user payload', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Bob Builder',
            email: 'bob@example.com',
            password: 'supersecure123',
            role: 'user',
          });

        expect(response.status).toBe(201);
        expect(response.body.data.token).toBeTruthy();
        expect(response.body.data.user.email).toBe('bob@example.com');
        expect(response.body.data.user.passwordHash).toBeUndefined();
      });

      it('rejects protected user route without Bearer token', async () => {
        const response = await request(app).get('/api/users/some-id');

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('UNAUTHORIZED');
      });

      it('logs in seeded admin and allows protected route with token', async () => {
        const login = await request(app)
          .post('/api/auth/login')
          .send({ email: 'alice@example.com', password: 'workshop-password' });

        const token = login.body.data.token;
        const userId = login.body.data.user.id;

        const userResponse = await request(app)
          .get('/api/users/' + userId)
          .set('Authorization', 'Bearer ' + token);

        expect(userResponse.status).toBe(200);
        expect(userResponse.body.data.email).toBe('alice@example.com');
  });
});`}</CodeBlock>
      </Collapsible>

      <div className="callout callout-info">
        <strong>🔍 Review checklist for API tests:</strong>
        <ul>
              <li>Does the test verify the response envelope shape (for example <code>data.user</code>, <code>error.code</code>)?</li>
              <li>Do protected-route tests include both missing-token and valid-token cases?</li>
              <li>Are sensitive fields like <code>passwordHash</code> excluded from public responses?</li>
              <li>Are duplicate-email and invalid-credential failures asserted with stable error codes?</li>
        </ul>
      </div>

      <h2>Step 3 — Run the API Tests</h2>
          <CodeBlock language="bash">{`npm run test:api`}</CodeBlock>
          <VerifyBlock>{`PASS tests/api/auth-and-users.test.ts
      Auth and user API
        ✓ should register a user and return token with public profile
        ✓ should reject requests to protected user route without bearer token
        ✓ should login seeded admin and read protected user route with bearer token
        ✓ should reject duplicate registration with structured error payload

Tests: 4 passed, 4 total`}</VerifyBlock>

          <h2>Part B — Integration Tests with Real Persistence</h2>
      <p>
            For integration coverage, test service + repository behavior without
            mocking persistence. In this workshop app, the repository persists to
            a local JSON file, so you can validate realistic state transitions.
      </p>
          <CodeBlock language="bash">{`Write a Jest integration test for UserRepository with file-backed persistence.
    Test: save user, read by email, reset repository, verify user no longer exists.
    Use beforeEach to call repo.reset() so tests are isolated.`}</CodeBlock>

          <CodeBlock language="typescript">{`// tests/integration/userRepository.integration.test.ts
import { UserRepository } from '../../src/repositories/userRepository';

describe('UserRepository (integration)', () => {
  let repo: UserRepository;

      beforeEach(async () => {
        repo = new UserRepository();
        await repo.reset();
  });

      afterEach(async () => {
        await repo.reset();
  });

      it('saves and reads a user by email', async () => {
        await repo.save({
          id: '1',
          name: 'Alice',
          email: 'alice@example.com',
          passwordHash: 'hash',
          role: 'viewer',
          createdAt: new Date(),
        });

    const found = await repo.findByEmail('alice@example.com');

    expect(found?.id).toBe('1');
    expect(found?.name).toBe('Alice');
  });

      it('removes persisted users after reset', async () => {
        await repo.save({
          id: '2',
          name: 'Bob',
          email: 'bob@example.com',
          passwordHash: 'hash',
          role: 'user',
          createdAt: new Date(),
        });

        await repo.reset();

        const result = await repo.findByEmail('bob@example.com');
        expect(result).toBeNull();
  });
});`}</CodeBlock>

      <div id="api-exercise">
      <TimedExercise minutes={8} title="Hands-on Challenge">
        <p>
              Add DELETE route coverage with auth. Use Copilot to generate tests
              for both authorized deletion and unauthorized access.
        </p>
        <Collapsible title="Hint: What to check in the generated DELETE test" variant="hint">
          <ul>
                <li>Does the test first obtain a valid token from login or registration?</li>
                <li>Does it verify <code>204 No Content</code> for a valid authenticated delete?</li>
                <li>Does it include an unauthorized case (missing or invalid Bearer token)?</li>
          </ul>
        </Collapsible>
        <Collapsible title="Full Solution" variant="solution">
              <CodeBlock language="typescript">{`it('deletes a user with valid Bearer token', async () => {
      const registration = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Delete Me',
          email: 'delete-me@example.com',
          password: 'supersecure123',
          role: 'viewer',
        });

      const token = registration.body.data.token;
      const userId = registration.body.data.user.id;

      const response = await request(app)
        .delete('/api/users/' + userId)
        .set('Authorization', 'Bearer ' + token);

      expect(response.status).toBe(204);
    });
  });
    it('rejects delete without Bearer token', async () => {
      const response = await request(app).delete('/api/users/some-id');
    mockUserService.prototype.deleteUser = jest.fn().mockRejectedValue(new Error('User not found'));
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});`}</CodeBlock>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="api-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Copilot is strongest when you provide route details and response contracts up front</li>
            <li>Verify both status and payload structure (for example <code>data</code> and <code>error.code</code>)</li>
            <li>Protected route tests should always include both unauthorized and authorized cases</li>
            <li>Integration tests should touch real persistence boundaries, not only mocked services</li>
            <li>Use deterministic reset helpers between tests to prevent state leakage</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default ApiIntegration;
