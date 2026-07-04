import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';

const CopilotIntro: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 2</span>
      <h1>Introduction to GitHub Copilot</h1>
      <PageMeta duration="25 min" difficulty="beginner" />
      <p className="page-lead">
        GitHub Copilot is an AI-powered coding assistant built on large language
        models. Before using it for test generation, you need to understand what
        it is, how it reasons about your code, which interaction modes exist, the
        full command vocabulary available to you in VS Code, and how to customize
        it with instruction files, MCP servers, and skills.
      </p>

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#intro-foundations">Jump to foundations</a>
        <a href="#intro-customization">Jump to customization</a>
        <a href="#intro-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 10 min Copilot fundamentals, 10 min workflow/customization patterns, 5 min prompt challenge and recap.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "Copilot is a collaborator, not an authority. You choose the right mode,
        provide context, and review the output. The better your prompt and scope,
        the better the draft. Our goal today is controlled acceleration, not blind automation."
      </div>

      <ArchDiagram
        title="How GitHub Copilot Works"
        nodes={[
          { label: 'Your Code + Context', icon: '📝' },
          { label: 'Copilot Extension', icon: '🔌' },
          { label: 'LLM (GPT-4o / Claude / Gemini)', icon: '🧠' },
          { label: 'Suggestion / Response', icon: '✨' },
          { label: 'Your Editor', icon: '💻' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'sent as prompt' },
          { from: 1, to: 2, label: 'forwarded to' },
          { from: 2, to: 3, label: 'generates' },
          { from: 3, to: 4, label: 'rendered in' },
        ]}
      />

      <h2 id="intro-foundations">What GitHub Copilot Is</h2>
      <p>
        GitHub Copilot is an AI pair programmer embedded in your editor. It reads
        the code you have open — the current file, related files, comments, and
        your cursor position — and predicts what you likely want to write or asks
        you clarifying questions. It does <strong>not</strong> execute your code
        autonomously unless you use Agent mode; otherwise it reasons purely from
        the context window it receives.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Available models</td>
            <td>GPT-4o, Claude Sonnet, Gemini, o3-mini, and more — switchable per session</td>
          </tr>
          <tr>
            <td>Context window</td>
            <td>Up to ~64 k tokens of surrounding code, comments, and open files</td>
          </tr>
          <tr>
            <td>Supported IDEs</td>
            <td>VS Code, JetBrains, Visual Studio, Neovim, Xcode, Eclipse, and more</td>
          </tr>
          <tr>
            <td>Supported languages</td>
            <td>All major languages; strongest for JavaScript/TypeScript, Python, Go, Java, C#</td>
          </tr>
          <tr>
            <td>Data privacy</td>
            <td>Prompts and suggestions are not retained for model training on Business/Enterprise plans</td>
          </tr>
        </tbody>
      </table>

      <h2>Interaction Surfaces</h2>
      <p>
        Copilot surfaces in VS Code in several ways. Each targets a different
        workflow:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Surface</th>
            <th>Shortcut</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Inline completions</strong></td>
            <td>Just start typing — ghost text appears automatically</td>
            <td>Boilerplate, function bodies, one-liners; accept with <kbd>Tab</kbd></td>
          </tr>
          <tr>
            <td><strong>Next Edit Suggestions (NES)</strong></td>
            <td><kbd>Tab</kbd> to navigate &amp; accept gutter arrow suggestions</td>
            <td>Copilot proactively predicts the next edit location across files</td>
          </tr>
          <tr>
            <td><strong>Inline Chat</strong></td>
            <td><kbd>⌘I</kbd> / <kbd>Ctrl+I</kbd></td>
            <td>Targeted edits — refactor, add tests, or fix a specific code region</td>
          </tr>
          <tr>
            <td><strong>Chat sidebar</strong></td>
            <td><kbd>⌃⌘I</kbd> / <kbd>Ctrl+Alt+I</kbd></td>
            <td>Conversations, code generation, explanations, multi-file tasks</td>
          </tr>
          <tr>
            <td><strong>Quick Chat</strong></td>
            <td><kbd>⇧⌥⌘L</kbd> / <kbd>Ctrl+Shift+Alt+L</kbd></td>
            <td>Fast one-off questions without leaving your current context</td>
          </tr>
        </tbody>
      </table>

      <h2>Chat Modes</h2>
      <p>
        The Chat sidebar has three modes, selectable from the dropdown at the
        bottom of the chat view:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>What it does</th>
            <th>When to use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Ask</strong></td>
            <td>Answers coding questions and provides code suggestions</td>
            <td>Understanding code, exploring ideas, getting help with syntax</td>
          </tr>
          <tr>
            <td><strong>Agent</strong></td>
            <td>Autonomously edits files, runs terminal commands, iterates until task is complete</td>
            <td>Complex multi-step tasks — generate tests, refactor, fix bugs end-to-end</td>
          </tr>
          <tr>
            <td><strong>Plan</strong></td>
            <td>Creates a detailed implementation plan <em>before</em> touching any code</td>
            <td>Large features where you want to review the approach before Copilot acts</td>
          </tr>
        </tbody>
      </table>

      <h3>What Changed in Modern Copilot</h3>
      <p>
        If your mental model is from older Copilot releases, these are the
        highest-impact shifts to adopt before using Copilot for production test
        workflows.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Then</th>
            <th>Now</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mostly inline autocomplete</td>
            <td>Ask, Plan, and Agent modes support multi-step test generation and refactoring workflows</td>
          </tr>
          <tr>
            <td>Manual model picking for most tasks</td>
            <td>Auto model selection is usually the best default for quality, reliability, and cost balance</td>
          </tr>
          <tr>
            <td>One-off prompts with limited operational controls</td>
            <td>Agent sessions are manageable artifacts: monitor logs, steer mid-run, and continue in VS Code or CLI</td>
          </tr>
          <tr>
            <td>Tooling mostly local to editor context</td>
            <td>MCP and cloud-agent integrations can bring GitHub, browser, and platform context directly into workflows</td>
          </tr>
          <tr>
            <td>Few safety boundaries around agentic execution</td>
            <td>Sandboxing, least-privilege tools, and automation policies are core governance controls</td>
          </tr>
        </tbody>
      </table>

      <h3>Agent Management in Practice</h3>
      <p>
        Modern Copilot workflows are not just about starting an agent task. GitHub
        now emphasizes managing agent sessions as ongoing work: start tasks,
        inspect logs, steer mid-run, and resume the work in your local tools when
        needed.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Capability</th>
            <th>Why it matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Run multiple sessions</td>
            <td>Useful when one agent investigates a flaky test while another drafts a fix or refactor</td>
          </tr>
          <tr>
            <td>Steer mid-session</td>
            <td>Lets you narrow scope, request a safer tool choice, or force the agent to inspect a specific failure signal</td>
          </tr>
          <tr>
            <td>Review logs and outputs</td>
            <td>Important for trust: you should see what the agent tried before you accept any code or PR changes</td>
          </tr>
          <tr>
            <td>Open in VS Code or Copilot CLI</td>
            <td>Helpful when cloud-agent work needs local follow-up, faster iteration, or deeper debugging against your environment</td>
          </tr>
        </tbody>
      </table>
      <div className="callout callout-info">
        <strong>Workshop rule</strong>
        Use <strong>Plan</strong> first for risky or broad work, then <strong>Agent</strong>
        for execution, and always review session logs or diffs before treating the
        result as trustworthy.
      </div>

      <h2>Model Selection for Testing Tasks</h2>
      <p>
        Model availability changes by plan and rollout, so optimize for task fit
        instead of memorizing one "best" model. Pick the smallest scope and
        cheapest prompt that still produces reliable output, then escalate only
        when complexity increases.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Task profile</th>
            <th>Recommended approach</th>
            <th>Escalate when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fast test draft</td>
            <td>Use a lightweight model path with narrow <code>#file</code> context</td>
            <td>Generated assertions are vague or miss negative paths</td>
          </tr>
          <tr>
            <td>Bug triage and flaky failures</td>
            <td>Use a stronger reasoning model with explicit failure output</td>
            <td>Root cause still unclear after one focused iteration</td>
          </tr>
          <tr>
            <td>Multi-file refactor + tests</td>
            <td>Run <strong>Plan</strong> mode first, then <strong>Agent</strong> mode for implementation</td>
            <td>Task touches contracts, auth, or shared utilities</td>
          </tr>
        </tbody>
      </table>

      <h3>When to Use Auto Model Selection</h3>
      <p>
        Current GitHub guidance is to prefer <strong>Auto</strong> when you do not
        have a strong reason to pin a specific model. Auto routes work based on
        task complexity, current model availability, and policy restrictions,
        which usually improves reliability and reduces unnecessary cost.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Choice</th>
            <th>Use it when</th>
            <th>Watch out for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Auto</strong></td>
            <td>Daily chat, CLI, and agent work where you want the best default balance of speed, quality, and availability</td>
            <td>Admins may restrict which models Auto can choose; evaluation models may also be excluded by policy</td>
          </tr>
          <tr>
            <td>Pin a specific model</td>
            <td>You are reproducing an issue, comparing outputs, or intentionally using a stronger reasoning path</td>
            <td>Pinned models can cost more and may hit rate limits sooner than Auto</td>
          </tr>
        </tbody>
      </table>
      <div className="callout callout-info">
        <strong>Practical default</strong>
        Start with Auto for test generation and review loops. Switch to a pinned
        stronger model only when the task is clearly stuck, ambiguous, or spans
        multiple files and contracts.
      </div>

      <h2>Slash Commands (VS Code)</h2>
      <p>
        Type <code>/</code> in the Chat prompt box to see all available commands.
        The most useful ones for everyday and testing workflows:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/tests</code></td>
            <td>Generate unit tests for the selected code</td>
          </tr>
          <tr>
            <td><code>/explain</code></td>
            <td>Explain how the code in the active editor works</td>
          </tr>
          <tr>
            <td><code>/fix</code></td>
            <td>Propose a fix for problems in the selected code</td>
          </tr>
          <tr>
            <td><code>/fixTestFailure</code></td>
            <td>Find and fix a failing test automatically</td>
          </tr>
          <tr>
            <td><code>/new</code></td>
            <td>Scaffold a new project from a natural-language description</td>
          </tr>
          <tr>
            <td><code>/clear</code></td>
            <td>Start a fresh chat session</td>
          </tr>
          <tr>
            <td><code>/help</code></td>
            <td>Quick reference and basics of using Copilot Chat</td>
          </tr>
        </tbody>
      </table>

      <h2>Chat Participants (<code>@</code>)</h2>
      <p>
        Prepend <code>@</code> to route your question to a domain expert.
        Copilot can also infer the right participant automatically.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>Speciality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@workspace</code></td>
            <td>Understands your entire project structure, patterns, and cross-file relationships</td>
          </tr>
          <tr>
            <td><code>@github</code></td>
            <td>GitHub-specific skills: search issues, PRs, commits, web search</td>
          </tr>
          <tr>
            <td><code>@vscode</code></td>
            <td>VS Code commands, settings, and extension APIs</td>
          </tr>
          <tr>
            <td><code>@terminal</code></td>
            <td>Shell commands and integrated terminal context</td>
          </tr>
          <tr>
            <td><code>@azure</code></td>
            <td>Azure services — deploy, configure, and manage cloud resources (preview)</td>
          </tr>
        </tbody>
      </table>

      <h2>Context Variables (<code>#</code>)</h2>
      <p>
        Type <code>#</code> in the prompt box to attach specific context to your
        question. Copilot uses only what you include:
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Variable</th>
            <th>What it attaches</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>#file</code></td>
            <td>The full content of the current file</td>
          </tr>
          <tr>
            <td><code>#selection</code></td>
            <td>The currently highlighted text</td>
          </tr>
          <tr>
            <td><code>#function</code></td>
            <td>The function or method containing the cursor</td>
          </tr>
          <tr>
            <td><code>#class</code></td>
            <td>The class containing the cursor</td>
          </tr>
          <tr>
            <td><code>#project</code></td>
            <td>High-level project context (structure, dependencies)</td>
          </tr>
          <tr>
            <td><code>#sym</code></td>
            <td>The symbol (type, function, variable) at the cursor</td>
          </tr>
          <tr>
            <td><code>#path</code></td>
            <td>The file path of the active editor</td>
          </tr>
          <tr>
            <td><code>#line</code></td>
            <td>The current line of code</td>
          </tr>
        </tbody>
      </table>

      <h2>Keyboard Shortcuts Cheat Sheet</h2>
      <table className="info-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>macOS</th>
            <th>Windows / Linux</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Accept inline suggestion</td>
            <td><kbd>Tab</kbd></td>
            <td><kbd>Tab</kbd></td>
          </tr>
          <tr>
            <td>Dismiss suggestion</td>
            <td><kbd>Esc</kbd></td>
            <td><kbd>Esc</kbd></td>
          </tr>
          <tr>
            <td>Accept next word</td>
            <td><kbd>⌘→</kbd></td>
            <td><kbd>Ctrl+→</kbd></td>
          </tr>
          <tr>
            <td>Next suggestion</td>
            <td><kbd>⌥]</kbd></td>
            <td><kbd>Alt+]</kbd></td>
          </tr>
          <tr>
            <td>Previous suggestion</td>
            <td><kbd>⌥[</kbd></td>
            <td><kbd>Alt+[</kbd></td>
          </tr>
          <tr>
            <td>Open suggestions panel</td>
            <td><kbd>Ctrl+Enter</kbd></td>
            <td><kbd>Ctrl+Enter</kbd></td>
          </tr>
          <tr>
            <td>Open Inline Chat</td>
            <td><kbd>⌘I</kbd></td>
            <td><kbd>Ctrl+I</kbd></td>
          </tr>
          <tr>
            <td>Open Chat sidebar</td>
            <td><kbd>⌃⌘I</kbd></td>
            <td><kbd>Ctrl+Alt+I</kbd></td>
          </tr>
          <tr>
            <td>Open Quick Chat</td>
            <td><kbd>⇧⌥⌘L</kbd></td>
            <td><kbd>Ctrl+Shift+Alt+L</kbd></td>
          </tr>
        </tbody>
      </table>

      <h2>Tokens and the Context Window</h2>
      <p>
        Every piece of text sent to the LLM — your code, comments, chat history,
        and Copilot's own instructions — is converted into <strong>tokens</strong>.
        A token is roughly 3–4 characters of English text or a short code symbol.
        The context window is the total number of tokens the model can consider
        at once (~64 k for most Copilot models).
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Concept</th>
            <th>What it means for you</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Token budget</td>
            <td>Large files, long chat histories, and many open tabs all consume tokens — leaving less room for Copilot to reason</td>
          </tr>
          <tr>
            <td>Context quality beats quantity</td>
            <td>One focused <code>#file</code> reference beats five loosely-related open tabs</td>
          </tr>
          <tr>
            <td>Token cost in Agent mode</td>
            <td>Each Agent-mode prompt consumes GitHub AI Credits; keep tasks focused to avoid burning budget on irrelevant context</td>
          </tr>
          <tr>
            <td>MCP toolsets consume tokens too</td>
            <td>Enabling only the MCP toolsets you need improves accuracy and frees context for actual coding</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock language="text">{`Rough token estimates:
  1 line of TypeScript ≈ 10–20 tokens
  1 typical test file  ≈ 300–600 tokens
  64 k context window  ≈ ~200–300 lines of dense code

Rule of thumb: the more precise your #selection, the better the suggestion.`}</CodeBlock>

      <h2>GitHub Copilot Skills (<code>@github</code>)</h2>
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

      <h2 id="intro-customization">Customization Files</h2>
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
                <div className="filetree-item">📄 test-agent.md</div>
                <div className="filetree-item">📄 api-agent.md</div>
                <div className="filetree-item">📄 e2e-agent.md</div>
              </div>
              <div className="filetree-item">📂 .vscode/ → settings.json</div>
              <div className="filetree-item">📂 tests/</div>
              <div className="filetree-item">📂 pacts/</div>
            </div>
          </div>
        </div>
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

      <h2>How to Write Better Prompts</h2>
      <ul>
        <li>
          <strong>Write a comment first.</strong> A line like{' '}
          <code>// test that getUser returns 404 when user is not found</code>{' '}
          gives Copilot a clear target before it tries to complete code.
        </li>
        <li>
          <strong>Use <code>#file</code> or <code>#selection</code>.</strong> Explicit
          context variables beat relying on Copilot to infer what you mean.
        </li>
        <li>
          <strong>Mention the framework.</strong> Saying "using Jest with TypeScript"
          avoids mismatched syntax or wrong assertion libraries.
        </li>
        <li>
          <strong>Use Agent mode for end-to-end tasks.</strong> Ask it to "generate tests
          for all exported functions in <code>#file</code> and run them" — it will
          edit, run, and fix failures on its own.
        </li>
      </ul>

      <h2>A Minimal Example</h2>
      <p>
        Comment-driven inline completion — type the comment, press{' '}
        <kbd>Tab</kbd> to accept:
      </p>
      <CodeBlock language="typescript">{`// function that adds two numbers
function add(a: number, b: number): number {
  return a + b;
}

// test that add returns the correct sum
it('returns the correct sum', () => {
  expect(add(2, 3)).toBe(5);
});`}</CodeBlock>
      <p>
        Or use the Chat sidebar with a context variable:
      </p>
      <CodeBlock language="text">{`/tests #file write Jest unit tests covering happy path and edge cases`}</CodeBlock>

      <Collapsible title="Hands-on Challenge — Trigger Your First Suggestion">
        <p>
          Open any TypeScript or JavaScript file in your editor. Type the
          following comment and wait a moment:
        </p>
        <CodeBlock language="typescript">{`// function that checks if a string is a palindrome`}</CodeBlock>
        <p>
          Copilot should suggest a function body. Press <kbd>Tab</kbd> to accept
          it, then open Inline Chat (<kbd>⌘I</kbd> / <kbd>Ctrl+I</kbd>) and type:
        </p>
        <CodeBlock language="text">{`/tests write Jest tests for isPalindrome including edge cases`}</CodeBlock>
        <p>
          Accept the generated tests and run them with <code>npm test</code>.
          You've completed your first Copilot-assisted test generation!
        </p>
      </Collapsible>

      <div id="intro-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Copilot supports multiple LLMs (GPT-4o, Claude, Gemini) — switchable per session.</li>
            <li>Five surfaces: inline completions, NES, Inline Chat, Chat sidebar, Quick Chat.</li>
            <li>Three chat modes: <strong>Ask</strong> (Q&amp;A), <strong>Agent</strong> (autonomous), <strong>Plan</strong> (design-first).</li>
            <li>Every input consumes <strong>tokens</strong> — precise context (<code>#selection</code>, <code>#file</code>) beats broad context.</li>
            <li>Use <code>/tests</code>, <code>/fix</code>, and <code>/fixTestFailure</code> slash commands for testing workflows.</li>
            <li><code>@github</code> skills give Copilot access to issues, PRs, commits, and live web search.</li>
            <li><strong>MCP servers</strong> plug Copilot into external tools (GitHub, Playwright, databases, CI) via <code>.vscode/mcp.json</code>.</li>
            <li><strong>Customization files</strong> (<code>.github/copilot-instructions.md</code>, <code>*.instructions.md</code>, <code>AGENTS.md</code>) bake your conventions into every response.</li>
            <li>For broad conference audiences, use a core path first and keep Agent mode / enterprise governance as optional advanced branches.</li>
            <li>Always review suggestions — Copilot can confidently produce incorrect or insecure code.</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default CopilotIntro;
