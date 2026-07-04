import React from 'react';
import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';
import PageMeta from '../components/PageMeta';
import VerifyBlock from '../components/VerifyBlock';
import Collapsible from '../components/Collapsible';
import ArchDiagram from '../components/ArchDiagram';

const Prerequisites: React.FC = () => {
  return (
    <Layout>
      <div className="workshop-page">
        <h1>Prerequisites</h1>
        <PageMeta duration="10 min" difficulty="beginner" />
        <p className="page-lead">
          Before the workshop, make sure you have the tools below installed and
          a GitHub account with Copilot access enabled. The hands-on exercises
          assume you can run VS Code with GitHub Copilot active.
        </p>

        <ArchDiagram
          title="What You Need"
          nodes={[
            { label: 'GitHub Account', icon: '🐙' },
            { label: 'Copilot Access', icon: '🤖' },
            { label: 'VS Code', icon: '💻' },
            { label: 'Copilot Extension', icon: '⚡' },
            { label: 'Git', icon: '📦' },
            { label: 'Node.js 22+', icon: '🟩' },
          ]}
          connections={[
            { from: 0, to: 1, label: 'activates' },
            { from: 1, to: 3, label: 'powers' },
            { from: 2, to: 3, label: 'hosts' },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
          ]}
        />

        <h2>Required Tools &amp; Accounts</h2>
        <table className="info-table">
          <thead>
            <tr>
              <th>Tool / Account</th>
              <th>Purpose</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>GitHub Account</strong></td>
              <td>Required to sign in to GitHub Copilot in VS Code</td>
              <td><a href="https://github.com/signup" target="_blank" rel="noopener noreferrer">Sign up</a></td>
            </tr>
            <tr>
              <td><strong>GitHub Copilot Access</strong></td>
              <td>Copilot Free or a paid Copilot plan for full usage in the workshop</td>
              <td><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer">Activate Copilot</a></td>
            </tr>
            <tr>
              <td><strong>Visual Studio Code (latest)</strong></td>
              <td>Primary IDE for all hands-on exercises</td>
              <td><a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">Download VS Code</a></td>
            </tr>
            <tr>
              <td><strong>GitHub Copilot Extension</strong></td>
              <td>Primary VS Code integration for Copilot; Chat is available automatically in current VS Code setup</td>
              <td><a href="https://marketplace.visualstudio.com/items?itemName=GitHub.copilot" target="_blank" rel="noopener noreferrer">Install Extension</a></td>
            </tr>
            <tr>
              <td><strong>Git</strong></td>
              <td>Clone the starter repository and manage branches</td>
              <td><a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer">Install Git</a></td>
            </tr>
            <tr>
              <td><strong>Node.js 22+</strong></td>
              <td>Runtime for the sample application and test tools (Jest, Supertest)</td>
              <td><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Install Node.js</a></td>
            </tr>
          </tbody>
        </table>

        <h2>Verify Your Setup</h2>
        <p>Run these commands to confirm everything is ready before the workshop:</p>
        <CodeBlock language="bash">{`# Git
git --version

# Node.js
node --version   # must be 22+
npm --version

# VS Code — open from terminal
code --version`}</CodeBlock>

        <VerifyBlock>{`git version 2.x.x
v22.x.x (or higher)
10.x.x
1.9x.x (or higher)`}</VerifyBlock>

        <h2>Verify GitHub Copilot is Active</h2>
        <p>
          Open VS Code and check the status bar at the bottom. You should see
          the Copilot icon (a robot/star shape). If it shows a warning, sign in
          to GitHub via <strong>Accounts</strong> in the Activity Bar.
        </p>
        <CodeBlock language="bash">{`# Check Copilot is installed in VS Code
code --list-extensions | grep copilot`}</CodeBlock>
        <VerifyBlock>{`GitHub.copilot
      # Some installs also show GitHub.copilot-chat.
      # In current VS Code setup, Copilot Chat access is provided automatically.`}</VerifyBlock>

        <div className="callout callout-info">
          <strong>💡 Copilot Chat</strong> — Current GitHub guidance no longer requires a separate
          manual Copilot Chat install for VS Code setup. Sign in to GitHub Copilot in VS Code,
          then verify that chat is available from the Copilot UI before the workshop starts.
        </div>

        <h2>Get Your Own Copy of the Starter Repository</h2>
        <p>
          The starter repository is a <strong>GitHub template</strong>, so you get your own
          writable copy instead of a fork — needed if an exercise has you push a branch or
          open a PR. Open{' '}
          <a href="https://github.com/moatazeldebsy/copilot-testing-workshop" target="_blank" rel="noreferrer">
            github.com/moatazeldebsy/copilot-testing-workshop
          </a>
          , click <strong>Use this template → Create a new repository</strong>, then clone
          your new copy:
        </p>
        <CodeBlock language="bash">{`git clone https://github.com/YOUR_USERNAME/copilot-testing-workshop.git
cd copilot-testing-workshop/workshop-exercises
npm install`}</CodeBlock>
        <VerifyBlock>{`added 412 packages in 8s`}</VerifyBlock>

        <div className="callout callout-info">
          <strong>📌 Note</strong> — The exercises live in the <code>workshop-exercises/</code>
          folder of the repo above. It contains a small TypeScript REST API with intentionally
          incomplete test coverage for the hands-on exercises. If you only plan to read along
          without pushing anything, a plain <code>git clone</code> of the original repo works too.
        </div>

        <h2>No Local Setup? Use GitHub Codespaces</h2>
        <p>
          If Node.js, npm, or VS Code aren't cooperating on your machine, skip local setup
          entirely. On your own copy of the repo, click <strong>Code → Codespaces → Create
          codespace on master</strong>. The container builds in about 1–2 minutes, installs
          dependencies and the Playwright browser automatically, and opens VS Code in the
          browser with <code>workshop-exercises/</code> as the working folder and GitHub
          Copilot pre-installed.
        </p>
        <CodeBlock language="bash">{`npm run dev:api   # backend on port 4000
npm run dev       # frontend on port 3006`}</CodeBlock>
        <div className="callout callout-info">
          <strong>📌 Note</strong> — Codespaces forwards ports 3006 and 4000 automatically;
          a notification will offer to open them in your browser.
        </div>

        <h2>Knowledge Prerequisites</h2>
        <table className="info-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Expected Familiarity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unit, API &amp; integration testing</td>
              <td>Basic understanding of what each test type does</td>
            </tr>
            <tr>
              <td>TypeScript / JavaScript</td>
              <td>Comfortable reading and writing basic code</td>
            </tr>
            <tr>
              <td>Git</td>
              <td>Clone, branch, commit</td>
            </tr>
            <tr>
              <td>CI/CD basics</td>
              <td>Awareness of pipelines and automated checks</td>
            </tr>
            <tr>
              <td>GitHub Copilot</td>
              <td>No prior experience required — we start from scratch</td>
            </tr>
          </tbody>
        </table>

        <div className="challenge-section">
          <h2>🏋️ Pre-Workshop Check</h2>
          <p>
            Open the starter repo in VS Code and create a new TypeScript file.
            Start typing a function — does Copilot suggest a completion? If yes,
            you are all set!
          </p>
          <Collapsible title="Hint: Copilot not suggesting anything?" variant="hint">
            <p>Try these steps:</p>
            <ol>
              <li>Click the Copilot icon in the status bar and check it says <strong>Ready</strong></li>
              <li>Sign out and sign back in via <strong>Accounts</strong> → GitHub</li>
              <li>Open the Command Palette (<code>Cmd+Shift+P</code>) and run <strong>GitHub Copilot: Enable</strong></li>
              <li>Restart VS Code</li>
            </ol>
          </Collapsible>
        </div>
      </div>
    </Layout>
  );
};

export default Prerequisites;
