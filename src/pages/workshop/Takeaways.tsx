import React from 'react';
import Layout from '../../components/Layout';
import PageMeta from '../../components/PageMeta';
import { Link } from 'react-router-dom';

const Takeaways: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <h1>Key Takeaways</h1>
      <PageMeta duration="10 min" difficulty="beginner" />
      <p className="page-lead">
        You have reached the end of the workshop. Here is a summary of the five
        most important things to take back to your team today.
      </p>

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#takeaways-summary">Jump to summary</a>
        <a href="#takeaways-resources">Jump to resources</a>
        <a href="#takeaways-next">Jump to next steps</a>
      </div>

      <h2 id="takeaways-summary">The 5 Things That Matter Most</h2>
      <div className="summary-card">
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '2rem' }}>
          <li>
            <strong>Copilot accelerates testing — it does not replace judgement.</strong>{' '}
            Use it for boilerplate, mocks, fixtures, and edge-case discovery.
            Write security, compliance, and domain-critical tests yourself.
          </li>
          <li>
            <strong>Always follow the Generate → Review → Fix loop.</strong>{' '}
            Never commit AI-generated test code that has not passed your review
            checklist. High coverage from low-value tests creates false confidence.
          </li>
          <li>
            <strong>Specific prompts produce better tests.</strong>{' '}
            Include the method name, expected scenarios (success + errors), and
            which dependencies to mock. Vague prompts produce vague tests.
          </li>
          <li>
            <strong>Guardrails must be automated, not manual.</strong>{' '}
            ESLint test rules, gitleaks, coverage thresholds, and branch
            protection are what make AI-assisted testing safe at team scale.
          </li>
          <li>
            <strong>Measure quality, not just quantity.</strong>{' '}
            Track flaky test rate and mean time to detect bugs — not just
            coverage %. These tell you whether Copilot is actually helping.
          </li>
        </ol>
      </div>

      <h2>What You Practised Today</h2>

      <table className="info-table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Skill</th>
            <th>Take-Away</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link to="/workshop/setup">1. Setup</Link></td>
            <td>Copilot activation &amp; first suggestion</td>
            <td>Keyboard shortcuts, how to trigger suggestions</td>
          </tr>
          <tr>
            <td><Link to="/workshop/copilot-overview">2. Big Picture</Link></td>
            <td>Trust model &amp; risk areas</td>
            <td>Generate → Review → Fix loop, trust tiers</td>
          </tr>
          <tr>
            <td><Link to="/workshop/unit-testing">3. Unit Tests</Link></td>
            <td>Prompt patterns for unit tests</td>
            <td>Specific prompts, call-argument assertions, flaky risks</td>
          </tr>
          <tr>
            <td><Link to="/workshop/api-integration">4. API &amp; Integration</Link></td>
            <td>REST &amp; integration test scaffolding</td>
            <td>Supertest pattern, reviewing body assertions, in-memory DB</td>
          </tr>
          <tr>
            <td><Link to="/workshop/test-data-mocks">5. Test Data &amp; Mocks</Link></td>
            <td>Factory functions &amp; mock stubs</td>
            <td>Partial overrides, PII guardrail, faker usage</td>
          </tr>
          <tr>
            <td><Link to="/workshop/reviewing-tests">6. Review &amp; Guardrails</Link></td>
            <td>Review checklist &amp; self-correction prompts</td>
            <td>False confidence detection, ESLint rules</td>
          </tr>
          <tr>
            <td><Link to="/workshop/cicd-adoption">7. CI/CD &amp; Adoption</Link></td>
            <td>Pipeline quality gates</td>
            <td>gitleaks, coverage thresholds, CODEOWNERS, phased rollout</td>
          </tr>
        </tbody>
      </table>

      <h2 id="takeaways-resources">Resources to Continue Learning</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>What It Covers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://docs.github.com/en/copilot" target="_blank" rel="noopener noreferrer">GitHub Copilot Docs</a></td>
            <td>Official documentation, keyboard shortcuts, configuration</td>
          </tr>
          <tr>
            <td><a href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noopener noreferrer">gitleaks</a></td>
            <td>Secret scanning for AI-generated test data</td>
          </tr>
          <tr>
            <td><a href="https://jestjs.io/docs/configuration#coveragethreshold-object" target="_blank" rel="noopener noreferrer">Jest Coverage Thresholds</a></td>
            <td>Enforcing minimum coverage as a CI quality gate</td>
          </tr>
          <tr>
            <td><a href="https://fakerjs.dev/" target="_blank" rel="noopener noreferrer">@faker-js/faker</a></td>
            <td>Generating realistic but fake test data safely</td>
          </tr>
          <tr>
            <td><a href="https://github.com/jest-community/eslint-plugin-jest" target="_blank" rel="noopener noreferrer">eslint-plugin-jest</a></td>
            <td>ESLint rules for test quality (no truthy/falsy, etc.)</td>
          </tr>
          <tr>
            <td><code>docs/tutorials/</code></td>
            <td>Getting started guide and advanced scenarios reference</td>
          </tr>
          <tr>
            <td><code>docs/tutorials/facilitator-cheat-sheet.md</code></td>
            <td>One-page delivery script with timings, fallback paths, and fail-first demo flow</td>
          </tr>
        </tbody>
      </table>

      <h2 id="takeaways-next">What Next?</h2>
      <div className="audience-grid">
        <div className="audience-card">
          <div className="audience-icon">🚀</div>
          <h3>Apply It This Week</h3>
          <p>
            Pick one existing test file in your codebase. Use Copilot to add
            missing edge cases. Apply the review checklist. Commit the result.
          </p>
        </div>
        <div className="audience-card">
          <div className="audience-icon">🤝</div>
          <h3>Share With Your Team</h3>
          <p>
            Share the prompt templates and review checklist from this workshop.
            Start a discussion about where AI-assisted testing fits in your
            current workflow.
          </p>
        </div>
        <div className="audience-card">
          <div className="audience-icon">🔒</div>
          <h3>Add the Guardrails</h3>
          <p>
            Add gitleaks and the jest/no-truthy-falsy ESLint rule to your CI
            pipeline. These are the two highest-impact guardrails to add first.
          </p>
        </div>
      </div>

      <div className="callout callout-info" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <strong>Thank you for attending!</strong>
        <br />
        WeAreDevelopers World Congress · Berlin 2026
        <br />
        <em>GenAI in Testing: Using GitHub Copilot to Accelerate Quality Without Losing Trust</em>
      </div>
    </div>
  </Layout>
);

export default Takeaways;
