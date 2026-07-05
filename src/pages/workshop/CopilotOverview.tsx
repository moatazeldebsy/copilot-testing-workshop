import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import PollBlock from '../../components/PollBlock';
import TimedExercise from '../../components/TimedExercise';

const CopilotOverview: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 3</span>
      <h1>Copilot for Testing: The Big Picture</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        Before writing a single test with Copilot, you need a clear mental
        model: where does AI genuinely help, where does it introduce risk, and
        where is human judgment still non-negotiable? This step answers those
        questions.
      </p>

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#overview-generate">Jump to trust model</a>
        <a href="#overview-exercise">Jump to exercise</a>
        <a href="#overview-debrief">Jump to debrief</a>
      </div>

      <PollBlock
        question="How many of you have accepted a Copilot test suggestion without fully reading it?"
        options={[
          { emoji: '🙋', label: 'Yes, regularly' },
          { emoji: '🤔', label: 'A few times' },
          { emoji: '👋', label: 'Rarely' },
          { emoji: '✅', label: 'Never — I always review' },
        ]}
        note="This is the core challenge we'll tackle in this step."
      />

      <ArchDiagram
        title="The Copilot Trust Model"
        nodes={[
          { label: 'Copilot Suggestion', icon: '🤖' },
          { label: 'Human Review', icon: '👀' },
          { label: 'Test Suite', icon: '🧪' },
          { label: 'CI Pipeline', icon: '🔄' },
          { label: 'Production', icon: '🚀' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'reviewed by' },
          { from: 1, to: 2, label: 'merged into' },
          { from: 2, to: 3, label: 'runs in' },
          { from: 3, to: 4, label: 'guards' },
        ]}
      />

      <h2 id="overview-generate">Where Copilot Genuinely Helps in Testing</h2>

      <table className="info-table">
        <thead>
          <tr>
            <th>Use Case</th>
            <th>Why Copilot Helps</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Boilerplate generation</td>
            <td>Repetitive describe/it/expect blocks take seconds, not minutes</td>
            <td>Unit test stubs for a service class</td>
          </tr>
          <tr>
            <td>Mock &amp; stub scaffolding</td>
            <td>Recognizes dependency patterns and generates matching mocks</td>
            <td><code>jest.mock()</code> for an HTTP client</td>
          </tr>
          <tr>
            <td>Edge-case discovery</td>
            <td>Suggests boundary and negative test cases you might miss</td>
            <td>Empty arrays, null inputs, max values</td>
          </tr>
          <tr>
            <td>Test data generation</td>
            <td>Generates realistic fixture objects from type definitions</td>
            <td>Fake user, order, or product objects</td>
          </tr>
          <tr>
            <td>Refactoring existing tests</td>
            <td>Improves readability of assert-heavy or duplicate test code</td>
            <td>Extract shared setup into <code>beforeEach</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Where Human Judgment Is Still Essential</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Risk Area</th>
            <th>What Can Go Wrong</th>
            <th>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test correctness</td>
            <td>Copilot may assert the wrong value or test the wrong behaviour</td>
            <td>Always run tests and read what they actually verify</td>
          </tr>
          <tr>
            <td>False confidence</td>
            <td>High coverage % from low-value tests that don't catch real bugs</td>
            <td>Review test intent, not just coverage numbers</td>
          </tr>
          <tr>
            <td>Flaky tests</td>
            <td>Suggestions may use time-dependent or order-dependent assertions</td>
            <td>Check for <code>Date.now()</code>, random values, hardcoded delays</td>
          </tr>
          <tr>
            <td>Security risks</td>
            <td>Generated test data may include real-looking but sensitive values</td>
            <td>Never commit tokens, passwords, or PII — even in test files</td>
          </tr>
          <tr>
            <td>Business logic gaps</td>
            <td>Copilot cannot know your domain rules or compliance requirements</td>
            <td>Write domain-critical tests yourself; use Copilot only for scaffolding</td>
          </tr>
        </tbody>
      </table>

      <h2>The Generate → Review → Fix Loop</h2>
      <p>
        Every Copilot-assisted test follows the same three-phase loop. Skipping
        any phase is where quality problems enter the codebase.
      </p>
      <CodeBlock language="bash">{`# Phase 1: GENERATE — let Copilot write the first draft
# Trigger inline suggestion or use Copilot Chat:
# "Write unit tests for the UserService.createUser method"

# Phase 2: REVIEW — read every line critically
# Ask yourself:
#   - Does this test verify the right behaviour?
#   - Would it catch a real bug?
#   - Is the assertion specific enough?
#   - Any hardcoded secrets or real-looking PII?

# Phase 3: FIX — correct what Copilot got wrong
# Common fixes:
#   - Replace vague matchers (toBeTruthy) with precise ones (toBe('created'))
#   - Add missing edge cases
#   - Remove tests that only assert Copilot's own generated implementation`}</CodeBlock>

      <div className="callout callout-info">
        <strong>🧠 Mental Model</strong> — Think of Copilot as a fast junior developer
        who writes a first draft. Your job is the code review. The suggestion is a
        starting point, not a finished product.
      </div>

      <h2>Trust Tiers</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Tier</th>
            <th>Test Type</th>
            <th>Copilot Role</th>
            <th>Human Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>✅ High trust</td>
            <td>Boilerplate structure, happy path scaffold</td>
            <td>Write first draft</td>
            <td>Quick review</td>
          </tr>
          <tr>
            <td>⚠️ Medium trust</td>
            <td>Edge cases, error handling</td>
            <td>Suggest candidates</td>
            <td>Validate each case</td>
          </tr>
          <tr>
            <td>🚫 Low trust</td>
            <td>Security, compliance, domain rules</td>
            <td>Structural reference only</td>
            <td>Write the logic</td>
          </tr>
        </tbody>
      </table>

      <div id="overview-exercise">
      <TimedExercise minutes={8} title="Hands-on Challenge">
        <p>
          Open Copilot Chat and paste this prompt. Read the response and
          identify two things you would change before accepting the output:
        </p>
        <CodeBlock language="bash">{`Write 5 unit test cases for a function that validates an email address in TypeScript using Jest.`}</CodeBlock>
        <Collapsible title="What to look for in the response" variant="hint">
          <ul>
            <li>Does it test empty string / null inputs?</li>
            <li>Are assertions specific (exact error message) or vague (<code>toBeTruthy</code>)?</li>
            <li>Does it test RFC edge cases like <code>user+tag@domain.co.uk</code>?</li>
            <li>Does the test name clearly describe the scenario?</li>
          </ul>
        </Collapsible>
        <Collapsible title="Bonus: The missing test case" variant="bonus">
          <p>
            Add a test case that Copilot likely missed: an email with a valid
            format but a disposable domain (e.g. <code>test@mailinator.com</code>).
            Is this a unit test concern or a business-rule concern?
          </p>
        </Collapsible>
      </TimedExercise>
      </div>

      <div id="overview-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Copilot accelerates boilerplate, mocks, fixtures, and edge-case discovery</li>
            <li>It cannot know your domain, compliance rules, or production failures</li>
            <li>Always follow the Generate → Review → Fix loop — never skip Review</li>
            <li>Treat coverage numbers from AI-generated tests with extra scepticism</li>
            <li>Security-critical tests must be written by humans</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default CopilotOverview;
