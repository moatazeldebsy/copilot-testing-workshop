import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';

const CicdAdoption: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 8</span>
      <h1>CI/CD &amp; Team Adoption</h1>
      <PageMeta duration="10 min" difficulty="intermediate" />
      <p className="page-lead">
        AI-assisted testing only improves quality at scale when it is governed
        by CI/CD pipelines and clear team norms. This step shows how to add
        quality gates, security scanning for AI-generated code, and onboard a
        team without creating inconsistency or risk.
      </p>

      <ExerciseRepoCallout path="/workshop/cicd-adoption" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#cicd-generate">Jump to pipeline</a>
        <a href="#cicd-exercise">Jump to exercise</a>
        <a href="#cicd-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 5 min pipeline gates, 5 min policy and adoption, 5 min workflow challenge and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "Guardrails must live in CI, not in memory. Lint, tests, coverage, security scans,
        and ownership checks define production trust. AI code passes the exact same gates
        as human code, with no bypass path."
      </div>

      <ArchDiagram
        title="CI Pipeline with AI Test Guardrails"
        nodes={[
          { label: 'PR Opened', icon: '📬' },
          { label: 'Lint & Secret Scan', icon: '🔍' },
          { label: 'Test Suite', icon: '🧪' },
          { label: 'Coverage Gate', icon: '📊' },
          { label: 'Security Scan', icon: '🔒' },
          { label: 'Merge Allowed', icon: '✅' },
        ]}
        connections={[
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
          { from: 4, to: 5 },
        ]}
      />

      <h2 id="cicd-generate">GitHub Actions Pipeline with Quality Gates</h2>
      <p>
        Ask Copilot to generate a GitHub Actions workflow with the stages below.
        Review the output against your project's actual paths and thresholds.
      </p>
      <div className="callout callout-warning">
        <strong>Non-negotiable policy</strong> — AI-generated code must pass the exact same standards as human-written code. No bypass path.
      </div>

      <h2>Static and Security Analysis Matrix</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Gate Type</th>
            <th>Recommended Tools</th>
            <th>What It Catches</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lint and style</td>
            <td>ESLint, Checkstyle</td>
            <td>Invalid patterns, weak test assertions, consistency drift</td>
          </tr>
          <tr>
            <td>Static analysis</td>
            <td>CodeQL, SonarQube</td>
            <td>Logic flaws, taint paths, maintainability hotspots</td>
          </tr>
          <tr>
            <td>Dependency and SAST scan</td>
            <td>Snyk, Dependabot, Trivy</td>
            <td>Known CVEs, vulnerable transitive packages, insecure defaults</td>
          </tr>
          <tr>
            <td>Secret and token scan</td>
            <td>gitleaks, truffleHog</td>
            <td>Leaked credentials and API tokens in test fixtures or mocks</td>
          </tr>
        </tbody>
      </table>

      <h2>CI Decision Outcomes</h2>
      <p>
        For team clarity, define CI outcomes with explicit next actions:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Outcome</th>
            <th>Meaning</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>exit 0</code></td>
            <td>All gates passed</td>
            <td>Continue to merge checks</td>
          </tr>
          <tr>
            <td><code>exit 1</code></td>
            <td>Definitive failure</td>
            <td>Block merge and fix before retry</td>
          </tr>
          <tr>
            <td><code>exit 2</code></td>
            <td>Unclear or ambiguous result</td>
            <td>Require human triage and explicit reviewer sign-off</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock language="yaml">{`# .github/workflows/test.yml  (Copilot-generated — review paths and thresholds)
name: Test & Quality Gates

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Guardrail 1: Lint + test naming rules
      - name: Lint
        run: npm run lint

      # Guardrail 2: Secret scanning (catches AI-generated fake credentials)
      - name: Secret scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      # Guardrail 3: Run tests with coverage
      - name: Run tests
        run: npm test -- --coverage --coverageReporters=json-summary

      # Guardrail 4: Coverage threshold enforcement
      - name: Check coverage threshold
        run: |
          COVERAGE=$(node -e "
            const s = require('./coverage/coverage-summary.json');
            console.log(s.total.lines.pct);
          ")
          echo "Line coverage: $COVERAGE%"
          node -e "if ($COVERAGE < 80) { console.error('Coverage below 80%'); process.exit(1); }"`}</CodeBlock>

      <h2>Jest Coverage Threshold (in jest.config.ts)</h2>
      <CodeBlock language="typescript">{`// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',  // entry points excluded
  ],
};

export default config;`}</CodeBlock>

      <VerifyBlock>{`----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   84.2  |   73.1   |   88.9  |   84.2  |
----------|---------|----------|---------|---------|
✓ Coverage thresholds met`}</VerifyBlock>

      <h2>CODEOWNERS for AI-Generated Tests</h2>
      <p>
        Add a CODEOWNERS rule so AI-generated test PRs always get a designated
        reviewer with the right context:
      </p>
      <CodeBlock language="bash">{`# .github/CODEOWNERS
# All test files require review from a QA lead or senior dev
tests/                    @your-org/qa-leads
src/**/*.test.ts          @your-org/qa-leads
src/**/*.spec.ts          @your-org/qa-leads`}</CodeBlock>

      <h2>PR Template for AI-Assisted Code</h2>
      <CodeBlock language="markdown">{`<!-- .github/pull_request_template.md -->
## Changes
<!-- Describe what changed -->

## AI-Generated Code
- [ ] This PR contains AI-generated tests
- [ ] I applied the [AI test review checklist](../docs/tutorials/advanced-scenarios.md)
- [ ] Assertions are specific (no toBeTruthy/toBeFalsy)
- [ ] No hardcoded credentials or PII in test data
- [ ] All tests pass locally
- [ ] Coverage thresholds met`}</CodeBlock>

      <h2>Team Adoption Strategy</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Action</th>
            <th>Goal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Week 1–2</td>
            <td>Pilot with 1–2 volunteers; document what works and what does not</td>
            <td>Build evidence and internal best practices</td>
          </tr>
          <tr>
            <td>Week 3–4</td>
            <td>Share prompt templates and review checklist with the team</td>
            <td>Create shared standards before broad adoption</td>
          </tr>
          <tr>
            <td>Month 2</td>
            <td>Add ESLint rules and secret scanning to CI</td>
            <td>Automate the guardrails</td>
          </tr>
          <tr>
            <td>Month 3+</td>
            <td>Retrospective: measure flaky test rate, coverage quality, PR review time</td>
            <td>Validate that AI-assisted testing actually improves quality</td>
          </tr>
        </tbody>
      </table>

      <h2>Copilot Cloud Agent Automations</h2>
      <p>
        Current GitHub Copilot guidance also supports <strong>automations</strong>:
        scheduled or event-driven cloud-agent runs that can label issues, inspect
        pull requests, or attempt recurring maintenance work such as fixing
        failing tests overnight.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>What to remember</th>
            <th>Why it matters for testing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Use least-privilege tools only</td>
            <td>Limit an automation to the smallest action set needed for labeling, PR creation, or test-fix attempts</td>
          </tr>
          <tr>
            <td>Expect human review</td>
            <td>Automations can draft work, but reviewers still own merge decisions and ambiguous failures</td>
          </tr>
          <tr>
            <td>Do not trust unvetted external input</td>
            <td>Prompt-injection risk is lower when automations ignore untrusted events by default and you keep triggers narrow</td>
          </tr>
        </tbody>
      </table>
      <div className="callout callout-info">
        <strong>Good testing use case</strong>
        Run a nightly automation in a private repository that checks the main
        branch for failing tests, attempts a minimal fix, and opens a draft pull
        request for review the next morning.
      </div>

      <h2>Where Teams Can Trigger Copilot From</h2>
      <p>
        GitHub Copilot cloud agent is no longer limited to GitHub-only entry
        points. Teams can also trigger agent work from collaboration and planning
        tools such as Slack, Teams, Jira, Linear, and Azure Boards.
      </p>
      <div className="callout callout-info">
        <strong>Adoption implication</strong>
        These integrations are useful for triage and workflow convenience, but
        they also expand the amount of contextual data Copilot can ingest. Apply
        the same least-privilege, review, and prompt-safety rules you use inside
        GitHub itself.
      </div>

      <div className="callout callout-info">
        <strong>📏 Metrics that matter</strong> — Track{' '}
        <em>flaky test rate</em>, <em>mean time to detect</em> (how quickly tests catch bugs),
        and <em>PR review time</em> before and after Copilot adoption. Coverage % alone
        is not a quality metric.
      </div>

      <div id="cicd-exercise" className="challenge-section">
        <h2>🏋️ Hands-on Challenge</h2>
        <p>
          Ask Copilot to generate the complete <code>.github/workflows/test.yml</code>{' '}
          for the starter repo. Review it against the checklist: are the thresholds
          appropriate? Is the secret scan included? Are paths correct?
        </p>
        <Collapsible title="Hint: Prompt template" variant="hint">
          <CodeBlock language="bash">{`Generate a GitHub Actions workflow for a Node.js TypeScript project.
Include: npm ci, ESLint lint, Jest tests with coverage, coverage threshold check at 80%, gitleaks secret scan.
Trigger on: pull_request to main, push to main.`}</CodeBlock>
        </Collapsible>
        <Collapsible title="Bonus: Add a test summary comment" variant="bonus">
          <p>
            Add a step to the workflow that posts a test result summary as a PR
            comment using <code>actions/github-script</code>. Ask Copilot to
            generate this step and review whether it handles failures correctly.
          </p>
        </Collapsible>
      </div>

      <div id="cicd-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>CI pipelines are where guardrails become enforceable — not optional</li>
            <li>Always include a secret scan (gitleaks/truffleHog) in pipelines that accept AI-generated code</li>
            <li>Coverage thresholds in Jest config enforce a minimum quality floor automatically</li>
            <li>CODEOWNERS ensures AI-generated test PRs get the right reviewer</li>
            <li>Phase adoption gradually — validate with metrics before rolling out team-wide</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default CicdAdoption;
