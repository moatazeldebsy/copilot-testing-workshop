import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';
import { exerciseRepository } from '../../data/workshopSteps';

const Setup: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 1</span>
      <h1>Environment Setup</h1>
      <PageMeta duration="15 min" difficulty="beginner" />
      <p className="page-lead">
        In this step you will confirm that GitHub Copilot is active in VS Code,
        clone the starter repository, open the workspace, and trigger your first
        Copilot inline suggestion — all before writing a single test.
      </p>

      <ExerciseRepoCallout path="/workshop/setup" title="Workshop exercise repository" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#setup-generate">Jump to setup tasks</a>
        <a href="#setup-exercise">Jump to exercise</a>
        <a href="#setup-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 5 min environment prep, 5 min Copilot verification, 5 min guided setup challenge.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "By the end of this step, everyone should have the same baseline: repo cloned,
        dependencies installed, Copilot active, and one accepted suggestion. If this is broken,
        every later exercise slows down. I will pause now for environment blockers before we continue."
      </div>

      <ArchDiagram
        title="Your Setup"
        nodes={[
          { label: 'VS Code', icon: '💻' },
          { label: 'Copilot Extension', icon: '🤖' },
          { label: 'Starter Repo', icon: '📦' },
          { label: 'Sample API', icon: '🔌' },
          { label: 'Test Scaffold', icon: '🧪' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'runs' },
          { from: 0, to: 2, label: 'opens' },
          { from: 2, to: 3 },
          { from: 2, to: 4 },
        ]}
      />

      <h2 id="setup-generate">Step 1 — Clone the Starter Repository</h2>
      <CodeBlock language="bash">{`git clone ${exerciseRepository.cloneUrl}
    cd ${exerciseRepository.name}
npm install`}</CodeBlock>
      <VerifyBlock>{`added 412 packages in 8s`}</VerifyBlock>

      <h2>Step 2 — Open in VS Code</h2>
      <CodeBlock language="bash">{`code .`}</CodeBlock>
      <p>
        VS Code opens the workspace. You should see a <code>src/</code> folder
        containing a small Express REST API, a minimal UI flow for the later
        Playwright and RTL exercises, and a <code>tests/</code> folder with
        workshop scaffolding.
      </p>

      <h2>Step 3 — Verify Copilot Is Active</h2>
      <p>
        Look at the VS Code status bar (bottom). The Copilot icon should appear
        with no warning. If it shows a warning, click it and sign in to GitHub.
      </p>
      <CodeBlock language="bash">{`# Confirm Copilot is available in VS Code
code --list-extensions | grep copilot`}</CodeBlock>
      <VerifyBlock>{`GitHub.copilot
# GitHub.copilot-chat may also appear on some installs.
# Chat is available automatically in current VS Code Copilot setup.`}</VerifyBlock>

      <div className="callout callout-info">
        <strong>💡 Current setup note</strong>
        GitHub's current VS Code setup flow installs the required Copilot pieces automatically.
        Do not treat the old separate <code>GitHub.copilot-chat</code> install as a workshop prerequisite.
      </div>

      <h2>Step 1 — Your First Copilot Suggestion</h2>
      <p>
        Create a new file <code>tests/smoke.test.ts</code> and start typing.
        Copilot will suggest a completion — press <kbd>Tab</kbd> to accept it.
      </p>
      <CodeBlock language="typescript">{`// tests/smoke.test.ts
// Type the line below slowly and watch Copilot suggest the rest:
describe('smoke', () => {
  it('should pass', () => {
    // Copilot will suggest: expect(true).toBe(true);
  });
});`}</CodeBlock>

      <div className="callout callout-info">
        <strong>💡 Keyboard shortcuts</strong>
        <table className="info-table" style={{ marginTop: '0.5rem' }}>
          <thead><tr><th>Action</th><th>macOS</th><th>Windows / Linux</th></tr></thead>
          <tbody>
            <tr><td>Accept suggestion</td><td><kbd>Tab</kbd></td><td><kbd>Tab</kbd></td></tr>
            <tr><td>Dismiss suggestion</td><td><kbd>Esc</kbd></td><td><kbd>Esc</kbd></td></tr>
            <tr><td>Next suggestion</td><td><kbd>Option+]</kbd></td><td><kbd>Alt+]</kbd></td></tr>
            <tr><td>Open Copilot Chat</td><td><kbd>Cmd+I</kbd></td><td><kbd>Ctrl+I</kbd></td></tr>
          </tbody>
        </table>
      </div>

      <h2>Step 2 — Run the Existing Tests</h2>
      <CodeBlock language="bash">{`npm test`}</CodeBlock>
      <VerifyBlock>{`Test Suites: 0 passed, 0 total
Tests:       0 passed, 0 total

    # This is expected — main starts with incomplete or empty tests.
    # We will build the suites incrementally during the workshop.`}</VerifyBlock>

      <div id="setup-exercise" className="challenge-section">
        <h2>🏋️ Hands-on Challenge</h2>
        <p>
          Explore the starter repo structure. Find the main service file in{' '}
          <code>src/</code>. Open Copilot Chat (<kbd>Cmd+I</kbd>) and ask:{' '}
          <em>"What test cases should I write for this file?"</em>
        </p>
        <Collapsible title="Hint: What to look for" variant="hint">
          <p>
            Look for a file like <code>src/services/userService.ts</code> or{' '}
            <code>src/controllers/productController.ts</code>. Select the
            entire file content, open Copilot Chat, and type your question.
            Copilot will suggest relevant test cases based on the code.
          </p>
        </Collapsible>
        <Collapsible title="Bonus: Generate a Jest config" variant="bonus">
          <p>
            Open a new file <code>jest.config.ts</code> and ask Copilot to
            generate a Jest configuration for a TypeScript project. Compare the
            suggestion to the existing config in the starter repo.
          </p>
        </Collapsible>
      </div>

      <div id="setup-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Copilot works inline — start typing and it suggests; press Tab to accept</li>
            <li>Copilot Chat lets you ask questions about code in natural language</li>
            <li>The starter repo has intentionally incomplete tests — we generate them together</li>
            <li>Always verify Copilot is signed in before the session starts</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default Setup;
