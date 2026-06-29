import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import TimedExercise from '../../components/TimedExercise';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';
import PollBlock from '../../components/PollBlock';

const ReviewingTests: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 7</span>
      <h1>Reviewing AI Tests &amp; Guardrails</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        Accepting AI-generated tests without a systematic review process is
        where quality debt accumulates. This step gives you a concrete review
        checklist, prompt templates for self-correcting Copilot output, and
        patterns for enforcing guardrails at the team level.
      </p>

      <ExerciseRepoCallout path="/workshop/reviewing-tests" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#review-generate">Jump to checklist</a>
        <a href="#review-exercise">Jump to exercise</a>
        <a href="#review-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 7 min review checklist, 7 min guardrail patterns, 6 min applied challenge and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "This is where trust is won or lost. AI-generated tests do not get special treatment.
        We apply a severity-first checklist, remove vague assertions,
        and enforce the same review standards as any critical code path."
      </div>

      <PollBlock
        mode="quiz"
        quizId="reviewing-tests-assertion-priority"
        question="Quick check: which generated assertion should you refactor first in a review pass?"
        options={[
          {
            emoji: '⚠️',
            label: "expect(result).toBeDefined()",
            rationale: 'This can pass even when behavior is wrong. Replace with behavior-specific assertions plus dependency call checks.',
            isCorrect: true,
          },
          {
            emoji: '✅',
            label: "expect(res.status).toBe(201)",
            rationale: 'Status-code checks are useful, but they are not the weakest link. You usually tighten body-shape and behavior assertions next.',
          },
          {
            emoji: '🧪',
            label: "expect(mockRepo.save).toHaveBeenCalledTimes(1)",
            rationale: 'Call-count checks are helpful, but they are stronger than toBeDefined-style assertions because they verify interaction intent.',
          },
          {
            emoji: '🔍',
            label: "expect(error.message).toMatch(/invalid/)",
            rationale: 'Pattern-based error checks are often acceptable and resilient. They are usually not the first assertion to refactor.',
          },
        ]}
        note="Select an answer, reveal rationale, then compare with your team review checklist."
      />

      <ArchDiagram
        title="AI Test Review Pipeline"
        nodes={[
          { label: 'Generated Test', icon: '🤖' },
          { label: 'Review Checklist', icon: '✅' },
          { label: 'Security Scan', icon: '🔒' },
          { label: 'PR Review', icon: '👀' },
          { label: 'Merged to Main', icon: '🚀' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'goes through' },
          { from: 1, to: 2, label: 'then' },
          { from: 2, to: 3, label: 'then' },
          { from: 3, to: 4, label: 'approved' },
        ]}
      />

      <h2 id="review-generate">The AI-Generated Test Review Checklist</h2>
      <p>
        Apply this checklist to every PR that contains AI-generated test code.
        Print it, pin it to your team channel, or add it as a PR template.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Check</th>
            <th>Why It Matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Does the test name describe expected behaviour, not implementation?</td>
            <td>Tests named after methods break on rename; behaviour names survive refactors</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Is the assertion specific enough to catch a real regression?</td>
            <td><code>toBeTruthy()</code> passes on <code>'false'</code>; use <code>toBe(true)</code></td>
          </tr>
          <tr>
            <td>3</td>
            <td>Could this test pass without the code it is testing?</td>
            <td>Tests that only assert what mocks return have zero value</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Are there hardcoded credentials, tokens, or PII in the test data?</td>
            <td>AI sometimes generates real-looking secrets as examples</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Does the test depend on time, random values, or execution order?</td>
            <td>These create flaky tests that erode CI trust</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Are error scenarios tested, not just happy paths?</td>
            <td>Copilot defaults to success cases unless explicitly asked otherwise</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Is the mock reset between tests (<code>afterEach</code>)?</td>
            <td>Stale mock state causes false passes in subsequent tests</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Do integration tests use isolated data (unique IDs, transactions)?</td>
            <td>Shared data between tests causes non-deterministic failures</td>
          </tr>
        </tbody>
      </table>

      <h2>Prompt Templates for Self-Correction</h2>
      <p>
        When Copilot's output fails your checklist, use these follow-up prompts
        in Copilot Chat to correct specific problems:
      </p>
      <CodeBlock language="bash">{`# Problem: vague assertions
"Review this test. Replace any toBeTruthy/toBeFalsy assertions with specific matchers."

# Problem: missing error cases
"This test suite only covers success paths. Add tests for all error conditions."

# Problem: tautological tests (testing mocks)
"Does this test actually verify the service behaviour, or does it only verify
 what the mock returns? If the latter, rewrite it to test a real behaviour."

# Problem: flaky time dependency
"This test uses new Date() or Date.now() in an assertion. Rewrite it to be
 time-independent using jest.useFakeTimers() or by comparing relative values."

# Problem: missing call-argument assertions
"Add assertions to verify that all mocked dependencies were called with the
 correct arguments, not just that they were called."

# General quality review
"Review this test file for: vague assertions, missing error scenarios,
 hardcoded secrets, flaky patterns, and missing mock resets. List issues found."`}</CodeBlock>

      <div className="callout callout-info">
        <strong>💡 Copilot can review its own output</strong> — Select the generated test,
        open Chat, and ask <em>"What is wrong with this test?"</em> Copilot will often identify
        issues it introduced. It is not infallible, but it is a fast first filter.
      </div>

      <h2>Spotting False Confidence</h2>
      <p>
        False confidence is when coverage metrics look good but the tests would
        not catch a real bug. These patterns are common in AI-generated output:
      </p>
      <CodeBlock language="typescript">{`// ❌ Tautological test — only verifies what the mock returns
it('should return a user', async () => {
  mockRepo.findById.mockResolvedValue({ id: '1', name: 'Alice' });
  const result = await userService.getUser('1');
  expect(result).toBeDefined();  // passes even if service does nothing
});

// ✅ Behaviour test — verifies the service transforms/validates the data
it('should return a user with formatted name', async () => {
  mockRepo.findById.mockResolvedValue({ id: '1', name: '  alice  ' });
  const result = await userService.getUser('1');
  expect(result.name).toBe('Alice');           // verifies trimming + capitalisation
  expect(mockRepo.findById).toHaveBeenCalledWith('1');  // verifies correct lookup
});`}</CodeBlock>

      <h2>Team-Level Guardrails</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Guardrail</th>
            <th>Implementation</th>
            <th>Enforced By</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>No <code>toBeTruthy/toBeFalsy</code> in tests</td>
            <td>ESLint rule: <code>jest/no-truthy-falsy</code></td>
            <td>Pre-commit / CI lint</td>
          </tr>
          <tr>
            <td>Minimum coverage threshold</td>
            <td>Jest <code>coverageThreshold</code> in config</td>
            <td>CI quality gate</td>
          </tr>
          <tr>
            <td>No secrets in test files</td>
            <td>gitleaks / truffleHog scan</td>
            <td>CI pre-merge</td>
          </tr>
          <tr>
            <td>PR description must note AI-generated tests</td>
            <td>PR template checkbox</td>
            <td>PR review process</td>
          </tr>
          <tr>
            <td>All tests pass before merge</td>
            <td>GitHub branch protection + required status checks</td>
            <td>GitHub repository settings</td>
          </tr>
        </tbody>
      </table>

      <h2>ESLint Config for Test Quality</h2>
      <CodeBlock language="json">{`// .eslintrc.json — add these rules for AI-assisted test quality
{
  "plugins": ["jest"],
  "rules": {
    "jest/no-truthy-falsy": "error",
    "jest/prefer-expect-assertions": "warn",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error"
  }
}`}</CodeBlock>

      <h2>PR Metadata and Auto-Labeling</h2>
      <p>
        Do not rely on memory for AI disclosure. Add a machine-readable signal
        in every AI-assisted test PR and auto-apply a label reviewers can filter.
      </p>
      <CodeBlock language="yaml">{`# .github/workflows/label-ai-pr.yml
name: Label AI-assisted PRs

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Add label when PR template indicates AI-generated tests
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.pull_request.body || '';
            const marker = '- [x] This PR contains AI-generated tests';
            if (body.includes(marker)) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.pull_request.number,
                labels: ['ai-generated-tests']
              });
            }`}</CodeBlock>

      <h2>Exercise B — Part 2: The Flaky-Test Moment</h2>
      <p>
        Flaky tests are not bugs in your code — they are bugs in your
        <em> assumptions</em>. Non-determinism makes a test pass sometimes and
        fail others, eroding trust in the whole suite.
      </p>

      <CodeBlock language="typescript">{`// ❌ Flaky — depends on wall-clock timing
it('sentAt is within 50ms of the call', () => {
  const before = Date.now();
  const log = notificationService.send(payload);
  const after = Date.now();

  // Fails on a loaded CI runner where the function takes > 50ms
  expect(log.sentAt.getTime()).toBeLessThanOrEqual(after + 50);
});

// ✅ Deterministic — mock the clock
it('sentAt is the mocked time', () => {
  jest.useFakeTimers().setSystemTime(new Date('2026-07-10T12:00:00Z'));

  const log = notificationService.send(payload);

  expect(log.sentAt).toEqual(new Date('2026-07-10T12:00:00Z'));

  jest.useRealTimers();
});`}</CodeBlock>

      <div className="callout callout-info">
        <strong>Copilot prompt to fix a flaky test</strong>
        <CodeBlock language="bash">{`"Make this test deterministic. The sentAt field depends on Date.now() —
replace the timing assertion with jest.useFakeTimers() and a fixed timestamp."`}</CodeBlock>
        <p style={{ marginTop: '0.5rem' }}>
          Alternatively, if you only need to verify <em>structure</em> rather than exact value:
          assert that <code>sentAt</code> is an instance of <code>Date</code>, not a specific timestamp.
        </p>
      </div>

      <table className="info-table">
        <thead>
          <tr>
            <th>Non-determinism source</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Date.now()</code> / <code>new Date()</code></td>
            <td><code>jest.useFakeTimers().setSystemTime(new Date(...))</code></td>
          </tr>
          <tr>
            <td><code>Math.random()</code></td>
            <td>Mock with <code>jest.spyOn(Math, 'random').mockReturnValue(0.5)</code></td>
          </tr>
          <tr>
            <td><code>sleep()</code> / fixed delays</td>
            <td>Use <code>waitFor()</code> — polls until ready or times out cleanly</td>
          </tr>
          <tr>
            <td>Shared module-level state</td>
            <td>Reset in <code>beforeEach</code>; generate unique IDs per test</td>
          </tr>
        </tbody>
      </table>

      <div id="review-exercise">
      <TimedExercise minutes={10} title="Hands-on Challenge">
        <p>
          Open the test file you generated in Step 4. Apply the review checklist
          above. Find at least two items that need fixing, use a Copilot Chat
          follow-up prompt to fix them, and verify the improved tests still pass.
        </p>
        <Collapsible title="Hint: Where to look first" variant="hint">
          <ul>
            <li>Check for <code>toBeTruthy()</code> or <code>toBeDefined()</code> — can you make them more specific?</li>
            <li>Check whether all mocked methods have a call-argument assertion</li>
            <li>Check whether there is an <code>afterEach(() =&gt; jest.clearAllMocks())</code></li>
          </ul>
        </Collapsible>
        <Collapsible title="Bonus: Write a PR template" variant="bonus">
          <p>
            Create a <code>.github/pull_request_template.md</code> that includes
            an "AI-Generated Code" section with the 8-point checklist above as
            checkboxes. Ask Copilot to generate the markdown for you.
          </p>
        </Collapsible>
      </TimedExercise>

      <TimedExercise minutes={10} title="Spot the Bad Tests">
        <p>
          Each snippet below was generated by Copilot. Identify the problem in
          each, explain why it's dangerous, and use Copilot to fix it.
        </p>

        <h3>Pattern 1 — The Flaky Wait</h3>
        <CodeBlock language="typescript">{`it('saves user to the database', async () => {
  await saveUser(user);
  await sleep(2000); // ← what's wrong here?
  expect(db.find(user.id)).toBeDefined();
});`}</CodeBlock>
        <Collapsible title="What's wrong?" variant="hint">
          <ul>
            <li><code>sleep(2000)</code> is a fixed 2-second wait — slow on fast machines, flaky on slow ones</li>
            <li>Use <code>waitFor(() =&gt; expect(db.find(user.id)).toBeDefined())</code> — polls until ready or times out cleanly</li>
            <li>Copilot fix prompt: <em>"Replace the sleep() with a proper waitFor() assertion"</em></li>
          </ul>
        </Collapsible>

        <h3>Pattern 2 — Shared State</h3>
        <CodeBlock language="typescript">{`const testOrderId = '550e8400-e29b-41d4-a716-446655440000'; // module-level

it('processes order', () => {
  const result = processOrder({ id: testOrderId }); // ← shared state?
  expect(result.status).toBe('complete');
});`}</CodeBlock>
        <Collapsible title="What's wrong?" variant="hint">
          <ul>
            <li>Module-level <code>testOrderId</code> is shared across all tests in the file</li>
            <li>If another test mutates the order with that ID, this test becomes order-dependent and flaky</li>
            <li>Fix: generate a fresh ID in each test with <code>crypto.randomUUID()</code> or use a factory</li>
          </ul>
        </Collapsible>

        <h3>Pattern 3 — Hardcoded Credential</h3>
        <CodeBlock language="typescript">{`const token = 'ghp_abc123realtoken456'; // ← never do this

it('calls API with auth header', async () => {
  const res = await apiClient.get('/users', { headers: { Authorization: \`Bearer \${token}\` } });
  expect(res.status).toBe(200);
});`}</CodeBlock>
        <Collapsible title="What's wrong?" variant="hint">
          <ul>
            <li>A hardcoded token committed to source control is a critical secret leak (OWASP A07)</li>
            <li>Even fake-looking tokens will trigger <strong>gitleaks</strong> and secret scanners</li>
            <li>Fix: use <code>process.env.TEST_API_TOKEN</code>; store real values in <code>.env.test</code> (gitignored)</li>
            <li>Copilot fix prompt: <em>"Replace the hardcoded token with process.env.TEST_API_TOKEN"</em></li>
          </ul>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="review-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>A systematic review checklist turns ad-hoc review into a repeatable process</li>
            <li>Copilot can review its own output — use Chat follow-up prompts to self-correct</li>
            <li>False confidence is more dangerous than no tests — detect it with behaviour-focused assertions</li>
            <li>Enforce guardrails with ESLint rules, gitleaks, and branch protection — not just reviews</li>
            <li>Label AI-generated test PRs explicitly so reviewers know to apply the checklist</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default ReviewingTests;
