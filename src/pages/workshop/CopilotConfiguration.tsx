import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import ArchDiagram from '../../components/ArchDiagram';
import TimedExercise from '../../components/TimedExercise';
import Collapsible from '../../components/Collapsible';

const CopilotConfiguration: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Configuring Copilot</span>
      <h1>Configuring Copilot for Your Team</h1>
      <PageMeta duration="20 min" difficulty="intermediate" />
      <p className="page-lead">
        Individual prompting only gets a team so far. This step covers the
        controls that make Copilot's output consistent, repeatable, and worth
        trusting across a whole repository: custom instructions, prompt files,
        chat modes, GitHub skills, agent personas, and MCP servers.
      </p>

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#config-skills">Jump to skills &amp; MCP</a>
        <a href="#config-customization">Jump to customization files</a>
        <a href="#config-debrief">Jump to debrief</a>
      </div>

      <h2 id="config-skills">GitHub Copilot Skills (<code>@github</code>)</h2>
      <p>
        The <code>@github</code> chat participant unlocks <strong>GitHub-specific
        skills</strong> — capabilities that go beyond your local codebase. Copilot
        automatically picks the right skill based on your question, or you can
        invoke them explicitly.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Skill / trigger</th>
            <th>What it does</th>
            <th>Example prompt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Web search (<code>#web</code>)</td>
            <td>Searches the web for up-to-date information</td>
            <td><code>@github #web what is the latest Jest LTS?</code></td>
          </tr>
          <tr>
            <td>Issue search</td>
            <td>Searches GitHub Issues across your repos</td>
            <td><code>@github find open bugs related to auth</code></td>
          </tr>
          <tr>
            <td>PR search</td>
            <td>Searches pull requests</td>
            <td><code>@github show recent PRs that touch the login flow</code></td>
          </tr>
          <tr>
            <td>Code search</td>
            <td>Searches across repositories you have access to</td>
            <td><code>@github find usages of validateToken</code></td>
          </tr>
          <tr>
            <td>Commit history</td>
            <td>Explains changes in recent commits</td>
            <td><code>@github what changed in the last 5 commits?</code></td>
          </tr>
        </tbody>
      </table>
      <p>
        Ask Copilot what skills are currently available:{' '}
        <code>@github What skills are available?</code>
      </p>

      <h2>Model Context Protocol (MCP)</h2>
      <p>
        MCP is an open standard that lets Copilot connect to <strong>external
        tools and services</strong> — databases, CI systems, APIs, cloud
        providers — via a standardized protocol. Think of MCP servers as plugins
        that expand what Copilot can do.
      </p>
      <ArchDiagram
        title="MCP: Copilot ↔ External Tools"
        nodes={[
          { label: 'Copilot Chat / Agent', icon: '🤖' },
          { label: 'MCP Client (VS Code)', icon: '🔌' },
          { label: 'MCP Server', icon: '⚙️' },
          { label: 'External Tool / API', icon: '🌐' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'sends request' },
          { from: 1, to: 2, label: 'MCP protocol' },
          { from: 2, to: 3, label: 'invokes' },
        ]}
      />
      <table className="info-table">
        <thead>
          <tr>
            <th>MCP Server</th>
            <th>What it gives Copilot access to</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>GitHub MCP Server</strong> (built-in)</td>
            <td>Issues, PRs, commits, branch creation, file push, Copilot cloud agent, code scanning</td>
          </tr>
          <tr>
            <td>Playwright MCP Server</td>
            <td>Browser automation — Copilot can navigate, click, and screenshot live pages</td>
          </tr>
          <tr>
            <td>Database MCP Servers</td>
            <td>Read schema, run queries — Copilot can reason about real data</td>
          </tr>
          <tr>
            <td>Custom MCP Servers</td>
            <td>Any REST/GraphQL API you wrap — CI pipelines, observability, internal tools</td>
          </tr>
        </tbody>
      </table>
      <p>
        Configure MCP servers in VS Code by adding a <code>.vscode/mcp.json</code>
        file (or workspace settings). The exercises repository ships one for
        the Playwright MCP server, used in Exercise D's live E2E demo:
      </p>
      <CodeBlock language="json">{`// workshop-exercises/.vscode/mcp.json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}`}</CodeBlock>
      <p>
        With this server running, Copilot can drive a real browser — navigate,
        click, and read the page — to write E2E tests grounded in what's
        actually on screen, instead of guessing selectors. The same file can
        list multiple servers; here's the remote GitHub MCP server added
        alongside it:
      </p>
      <CodeBlock language="json">{`{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}`}</CodeBlock>
      <p>
        For repository-level configuration (used by Copilot cloud agent and code
        review on GitHub.com), add a <code>.github/mcp.json</code> file. Discover
        community MCP servers at the{' '}
        <strong>GitHub MCP Registry</strong> (<code>github.com/mcp</code>).
      </p>
      <div className="infographic-diagram">
        <div className="infographic-diagram__title">Copilot Testing Workflow</div>
        <div className="infographic-workflow">
          {[
            { icon: '💬', label: 'Write prompt' },
            { icon: '📄', label: 'Load instructions' },
            { icon: '🧑‍💼', label: 'Select role / skill' },
            { icon: '🔧', label: 'Use MCP tools' },
            { icon: '</>', label: 'Generate tests' },
            { icon: '🛡️', label: 'Run checks' },
            { icon: '👥', label: 'Review & merge' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div className="infographic-workflow__step">
                <span className="infographic-workflow__icon">{step.icon}</span>
                <span className="infographic-workflow__label">{step.label}</span>
              </div>
              {i < arr.length - 1 && <span className="infographic-workflow__arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="infographic-workflow__types">
          {[
            { icon: '</>', label: 'Unit Tests' },
            { icon: '🌐', label: 'API Tests' },
            { icon: '🤝', label: 'Contract Tests' },
            { icon: '🖥️', label: 'E2E Tests' },
          ].map((t) => (
            <span key={t.label} className="infographic-workflow__type-badge">
              <span>{t.icon}</span> {t.label}
            </span>
          ))}
        </div>
        <p className="infographic-diagram__caption">Copilot combines repository instructions, defined roles, reusable skills, and external capabilities via MCP to plan, build, and validate high-quality tests.</p>
      </div>

      <h2 id="config-customization">Customization Files</h2>
      <p>
        Copilot reads several special files to understand your project conventions
        and apply them automatically to every response — no re-prompting needed.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Scope</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>.github/copilot-instructions.md</code></td>
            <td>Repository-wide</td>
            <td>Persistent instructions applied to every Copilot request in this repo (coding standards, stack info, test conventions)</td>
          </tr>
          <tr>
            <td><code>.github/instructions/*.instructions.md</code></td>
            <td>Path-specific</td>
            <td>Instructions scoped to files matching a glob pattern via <code>applyTo</code> frontmatter</td>
          </tr>
          <tr>
            <td><code>AGENTS.md</code> / <code>CLAUDE.md</code> / <code>GEMINI.md</code></td>
            <td>Agent-specific</td>
            <td>Instructions for AI agents — nearest file in the directory tree takes precedence</td>
          </tr>
          <tr>
            <td><code>README.md</code></td>
            <td>Project context</td>
            <td>Copilot reads it when exploring — a well-written README helps Agent mode navigate your project faster</td>
          </tr>
          <tr>
            <td><code>.github/prompts/*.prompt.md</code></td>
            <td>Reusable, invoked on demand</td>
            <td>Packages a proven prompt as a file the whole team can run with a slash command (for example <code>/generate-tests</code>) instead of retyping it</td>
          </tr>
          <tr>
            <td><code>.github/chatmodes/*.chatmode.md</code></td>
            <td>Custom chat persona</td>
            <td>Defines a scoped persona with its own instructions and a limited tool list — a specialist you summon instead of a generalist you nudge</td>
          </tr>
          <tr>
            <td><code>.github/agents/*.agent.md</code></td>
            <td>Selectable agent persona</td>
            <td>A full agent-mode persona with its own tools and (optionally) preferred model, chosen from the VS Code agents dropdown or <code>/agents</code> — or run as a cloud background agent from <code>github.com/copilot/agents</code>. Distinct from a chat mode: it can act end-to-end (edit files, run tests), not just converse</td>
          </tr>
        </tbody>
      </table>

      <h3>Prompt Files</h3>
      <p>
        A prompt file is Markdown with frontmatter, checked into the repo like
        any other config. Run it from Copilot Chat as a slash command:
      </p>
      <CodeBlock language="markdown">{`// .github/prompts/generate-tests.prompt.md
---
mode: agent
description: Generate tests for a file
---

Write Jest tests for \${file}.

- Cover happy path, edge, and error cases.
- Reuse factories from tests/factories.
- Do not test private functions.
- Stop and ask if behavior is unclear.`}</CodeBlock>
      <p>
        Invoke it in chat with <code>/generate-tests</code>. Because it's a
        file, it's version-controlled and reviewed like code — the whole team
        gets the same prompt, not whatever each person happened to type.
      </p>

      <h3>Custom Chat Modes</h3>
      <p>
        A chat mode restricts Copilot to a persona with its own instructions
        and a limited tool list — useful when you want a reviewer that can
        read and run tests but never write feature code:
      </p>
      <CodeBlock language="markdown">{`// .github/chatmodes/qa-reviewer.chatmode.md
---
description: QA reviewer — harden tests
tools: [read, search, runTests]
---

You are a meticulous QA reviewer.
Critique tests for weak assertions and flaky patterns; suggest fixes. Do not
write feature code.`}</CodeBlock>
      <p>
        Select it from the chat mode dropdown alongside the built-in Ask,
        Agent, and Plan modes. Granting only the tools a task needs (read,
        search, run tests — no file edits) limits the blast radius if the
        model goes off track.
      </p>

      <h3>Custom Agents</h3>
      <p>
        A custom agent goes further than a chat mode: it's a full agent-mode
        persona with its own tools, an optional preferred model, and its own
        validation command — it can read, edit, and run tests end-to-end
        instead of just critiquing in conversation. Define one as an{' '}
        <code>.agent.md</code> file under <code>.github/agents/</code>:
      </p>
      <CodeBlock language="markdown">{`// .github/agents/unit-test.agent.md
---
name: unit-test-agent
description: Generates and hardens unit tests for pure functions and services.
tools: [read, search, edit, runTests]
---

You are a focused unit-testing agent.
Scope: pure functions/services in src/services/. Do not modify files under src/.
Avoid weak assertions (toBeTruthy, toBeDefined) when a specific value can be checked.
Run npm run test:unit before reporting a task complete.`}</CodeBlock>
      <p>
        Pick it from the agents dropdown in Chat, or type <code>/agents</code>{' '}
        to open the agent picker. Because it's checked into the repo, the
        whole team gets the same tool restrictions and validation command —
        and organizations can define shared agents once in <code>.github</code>{' '}
        for every repository to pick up.
      </p>

      <p>
        In this workshop, participants can copy practical starter files from the
        exercises repository:
      </p>
      <ul>
        <li>
          <code>workshop-exercises/AGENTS.md</code> for default agent behavior and
          output style.
        </li>
        <li>
          <code>workshop-exercises/.github/copilot-instructions.md</code> for
          repository-wide coding and testing conventions.
        </li>
        <li>
          <code>workshop-exercises/.github/prompts/generate-tests.prompt.md</code> —
          run with <code>/generate-tests</code>.
        </li>
        <li>
          <code>workshop-exercises/.github/chatmodes/qa-reviewer.chatmode.md</code> —
          a review-only persona.
        </li>
        <li>
          <code>workshop-exercises/.github/skills/</code> — three reusable playbooks:
          <code>pact-contracts</code> (API contract review), <code>flaky-test-hunt</code>
          (timing/order/shared-state flakiness), and <code>test-generation</code>
          (scaffold tests from a target file).
        </li>
        <li>
          <code>workshop-exercises/.github/agents/</code> — three tier-scoped agent
          personas: <code>unit-test-agent</code>, <code>api-test-agent</code>, and{' '}
          <code>e2e-test-agent</code>, each with its own tools and validation command.
        </li>
      </ul>

      <div className="infographic-diagram">
        <div className="infographic-diagram__title">Recommended Project Structure for AI-Assisted Testing</div>
        <div className="infographic-filetree">
          <div className="filetree-root">
            <span className="filetree-folder">📂 project-root/</span>
            <div className="filetree-children">
              <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
              <div className="filetree-item filetree-item--highlight">📄 .github/copilot-instructions.md <span className="filetree-badge">Chat Standards</span></div>
              <div className="filetree-item">📂 .github/agents/</div>
              <div className="filetree-children">
                <div className="filetree-item">📄 unit-test.agent.md</div>
                <div className="filetree-item">📄 api-test.agent.md</div>
                <div className="filetree-item">📄 e2e-test.agent.md</div>
              </div>
              <div className="filetree-item">📂 .vscode/ → settings.json</div>
              <div className="filetree-item">📂 tests/</div>
              <div className="filetree-item">📂 pacts/</div>
            </div>
          </div>
        </div>
        <p className="infographic-diagram__caption">
          This isn't just a suggested layout — every file shown here exists in{' '}
          <code>workshop-exercises/</code> today, including the three agent
          personas under <code>.github/agents/</code>.
        </p>
        <div className="infographic-token-strategy">
          <div className="token-tier token-tier--always">
            <span className="token-tier__badge">⚡ Always Loaded (tiny)</span>
            <ul>
              <li>AGENTS.md</li>
              <li>copilot-instructions.md</li>
              <li>Critical root configs</li>
            </ul>
          </div>
          <div className="token-tier token-tier--scoped">
            <span className="token-tier__badge">🧑‍💼 Role-Scoped (medium)</span>
            <ul>
              <li>Relevant docs</li>
              <li>Role-specific guidance</li>
              <li>Shared patterns</li>
            </ul>
          </div>
          <div className="token-tier token-tier--demand">
            <span className="token-tier__badge">☁️ On-Demand (large)</span>
            <ul>
              <li>skills/ playbooks</li>
              <li>Example tests</li>
              <li>Reference materials</li>
            </ul>
          </div>
        </div>
        <p className="infographic-diagram__caption">Token strategy: keep tiny files always in context; load larger playbooks only when needed to avoid hitting context limits.</p>
      </div>

      <p>A minimal <code>.github/copilot-instructions.md</code> for a testing project:</p>
      <CodeBlock language="markdown">{`# Copilot Instructions

## Stack
- Language: TypeScript (strict mode)
- Test framework: Jest with ts-jest
- Assertion style: expect().toBe / toEqual / toMatchObject
- HTTP mocking: msw (Mock Service Worker)

## Test conventions
- One describe block per module
- Group by: happy path → edge cases → error cases
- Always assert on the specific value, not just existence
- Never use real credentials or production URLs in tests

## Build
- Run tests: npm test
- Lint: npm run lint
- Type-check: npm run type-check`}</CodeBlock>

      <p>
        Example <code>AGENTS.md</code> files from the exercises repository — root
        level plus two scoped variants:
      </p>
      <CodeBlock language="markdown">{`# AGENTS.md — root level (applies to all agents)

Mission: produce reliable tests quickly while preserving behavior.

Priorities:
1. Keep API contracts unchanged unless explicitly requested.
2. Prefer minimal, reviewable patches.
3. Validate with targeted test commands first.
4. For review tasks, report findings first.`}</CodeBlock>

      <CodeBlock language="markdown">{`# tests/unit/AGENTS.md — scoped to unit tests

Focus: calculateDiscount and pure functions.
Run: npm run test:unit
Do not modify src/ files.`}</CodeBlock>

      <CodeBlock language="markdown">{`# tests/api/AGENTS.md — scoped to API tests

Focus: checkout pipeline routes.
Attach: #file:.copilot/context/domain-rules.md
Run: npm run test:api`}</CodeBlock>

      <p>
        A path-specific instructions file that enforces API test patterns for all
        files under <code>src/api/</code>:
      </p>
      <CodeBlock language="markdown">{`---
applyTo: "src/api/**"
---

All API tests must:
- Use supertest for HTTP assertions
- Mock external dependencies with jest.mock()
- Assert on status code, response shape, AND error messages
- Never call real external services`}</CodeBlock>

      <div className="infographic-diagram">
        <div className="infographic-diagram__title">Nested AGENTS.md — Scoped Agent Personas</div>
        <div className="infographic-filetree">
          <div className="filetree-root">
            <span className="filetree-folder">📂 project-root/</span>
            <div className="filetree-children">
              <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
              <div className="filetree-item">📂 tests/</div>
              <div className="filetree-children">
                <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
                <div className="filetree-item">📂 unit/</div>
                <div className="filetree-children">
                  <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
                </div>
                <div className="filetree-item">📂 api/</div>
                <div className="filetree-children">
                  <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
                </div>
                <div className="filetree-item">📂 e2e/</div>
                <div className="filetree-children">
                  <div className="filetree-item filetree-item--highlight">🤖 AGENTS.md <span className="filetree-badge">Agent Persona</span></div>
                </div>
              </div>
              <div className="filetree-item">📂 pacts/</div>
            </div>
          </div>
        </div>
        <p className="infographic-diagram__caption">Nested AGENTS.md files let you define different agent personas at each level of your test hierarchy — unit, API, E2E. The nearest file in the directory tree takes precedence.</p>
      </div>

      <TimedExercise minutes={25} title="Hands-on: Put the Configuration Files to Work">
        <p>
          Everything above is easy to nod along to and never actually use. All six
          mechanisms already exist in <code>workshop-exercises/</code> — spend a few
          minutes actually invoking each one instead of just reading about it.
        </p>

        <h3>1. Verify copilot-instructions.md is actually being read</h3>
        <p>
          Like AGENTS.md, <code>copilot-instructions.md</code> is passive context — the way
          to "use" it is to confirm Copilot is honoring it. Open a fresh Copilot Chat
          without attaching or pasting any files, and ask: <em>"What test framework and
          assertion style should I use in this repo, and why?"</em>
        </p>
        <Collapsible title="What a correct answer looks like" variant="hint">
          <p>
            <code>.github/copilot-instructions.md</code>'s Stack/Test conventions section
            names Jest with <code>ts-jest</code>, exact-value assertions over{' '}
            <code>toBeTruthy</code>/<code>toBeDefined</code>, and the AAA structure. If
            Copilot's answer reflects those specifics without you having shown it the file,
            that confirms the repo-wide instructions are loaded automatically on every
            request — not just something you'd have to re-paste each time.
          </p>
        </Collapsible>

        <h3>2. Run the prompt file</h3>
        <p>
          In Copilot Chat, type <code>/generate-tests</code> and target a file that has no
          tests yet, e.g. <code>#file:src/services/paymentService.ts</code>. Compare the
          output to what you'd get from a hand-written Chat prompt like the ones in
          Exercise A — is the slash command faster? Less controllable?
        </p>

        <h3>3. Switch to the qa-reviewer chat mode</h3>
        <p>
          Select <strong>qa-reviewer</strong> from the chat mode dropdown, then paste in
          your Exercise A test file (or <code>calculateDiscount.weak.test.ts</code>) and
          ask it to critique the assertions. Since this mode's tools are limited to{' '}
          <code>[read, search, runTests]</code>, it can inspect and run tests but can't
          edit your files — does its critique match what you found manually in Exercise B?
        </p>

        <h3>4. Try one of the three skills</h3>
        <p>Pick whichever matches something you already have open:</p>
        <ul>
          <li>
            <strong>test-generation</strong> — run its recommended prompt against{' '}
            <code>src/services/cartService.ts</code> (same target as the Exercise A unit-testing
            bonus) and compare the result to the <code>.copilot/skills/unit-testing.md</code>{' '}
            template's output
          </li>
          <li>
            <strong>pact-contracts</strong> — run its recommended prompt against your
            Exercise C <code>checkout.test.ts</code>, attaching <code>#file:src/app.ts</code>{' '}
            as the route contract; see if it catches anything your manual review missed
          </li>
          <li>
            <strong>flaky-test-hunt</strong> — open{' '}
            <code>tests/unit/notificationService.test.ts</code> and look at the test marked{' '}
            🚨 FLAKY. Use the skill's recommended prompt to have Copilot explain the fix —
            but per the file's own comment, don't actually apply it; it's left flaky on
            purpose for Exercise E's CI discussion
          </li>
        </ul>

        <h3>5. Verify AGENTS.md is actually being read</h3>
        <p>
          AGENTS.md is passive context, not something you run — so the way to "use" it is to
          confirm Copilot is actually honoring it. In Copilot Chat, with a file under{' '}
          <code>tests/unit/</code> open, ask: <em>"What are you not allowed to modify while
          working in this folder, and why?"</em>
        </p>
        <Collapsible title="What a correct answer looks like" variant="hint">
          <p>
            <code>tests/unit/AGENTS.md</code> states <em>"Do not modify files under{' '}
            <code>src/</code>."</em> If Copilot's answer reflects that constraint without you
            having pasted the file into the conversation, that's the nested AGENTS.md being
            picked up automatically based on which file you have open — confirming the
            "nearest file wins" behavior from the diagram above. If it doesn't mention this,
            check that you're not in a chat mode that ignores repo context.
          </p>
        </Collapsible>

        <h3>6. Invoke a custom Agent</h3>
        <p>
          Type <code>/agents</code> in Copilot Chat (or open the agents dropdown) and select{' '}
          <strong>unit-test-agent</strong>. Point it at{' '}
          <code>#file:src/services/cartService.ts</code> — the same target you used with the{' '}
          <strong>test-generation</strong> skill in step 4. Compare the two runs: the skill is
          a one-shot playbook you invoke inside whatever mode you're already in, while the
          agent brings its own restricted tool list (<code>[read, search, edit, runTests]</code>)
          and runs <code>npm run test:unit</code> itself before handing control back. Which one
          gave you more confidence in the result without you having to check its work?
        </p>
      </TimedExercise>

      <div id="config-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li><code>@github</code> skills give Copilot access to issues, PRs, commits, and live web search.</li>
            <li><strong>MCP servers</strong> plug Copilot into external tools (GitHub, Playwright, databases, CI) via <code>.vscode/mcp.json</code>.</li>
            <li><strong>Customization files</strong> (<code>.github/copilot-instructions.md</code>, <code>*.instructions.md</code>, <code>AGENTS.md</code>) bake your conventions into every response — no re-typing the same prompt.</li>
            <li><strong>Prompt files</strong> (<code>.github/prompts/*.prompt.md</code>) package a proven prompt as a team-wide slash command.</li>
            <li><strong>Custom chat modes</strong> (<code>*.chatmode.md</code>) scope a persona to a limited, reviewed tool list — a specialist you summon, not a generalist you nudge.</li>
            <li><strong>Custom agents</strong> (<code>.github/agents/*.agent.md</code>) go a step further than chat modes — a selectable, tool-equipped persona that can edit files and run its own validation command end-to-end, locally or as a cloud background agent.</li>
            <li>Nested <code>AGENTS.md</code> files let different test layers (unit, API, E2E) have different agent personas — the nearest file wins.</li>
            <li>Repo-wide instructions and AGENTS.md are passive context — verify Copilot is actually honoring them by asking it to state a convention it was never shown directly.</li>
            <li>Layer context by cost: tiny always-loaded files, medium role-scoped docs, large on-demand skill playbooks.</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default CopilotConfiguration;
