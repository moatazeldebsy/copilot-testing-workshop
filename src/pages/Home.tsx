import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import ProgressCard from '../components/ProgressCard';
import { workshopSections } from '../data/workshopSteps';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-top-bar">
            <ThemeToggle />
          </div>
          <span className="hero-badge">WeAreDevelopers Berlin 2026 · 120-Minute Workshop</span>
          <h1 className="hero-title">GenAI in Testing</h1>
          <p className="hero-subtitle">
            Using GitHub Copilot to Accelerate Quality Without Losing Trust
          </p>
          <p className="hero-description">
            Generative AI is rapidly changing how developers write code—but its
            impact on testing is often misunderstood. This hands-on workshop
            explores how to use GitHub Copilot effectively and responsibly for
            testing: generating unit, API, and integration tests; reviewing and
            validating AI output; and building guardrails that keep quality high.
          </p>
          <div className="hero-actions">
            <Link to="/prerequisites" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/workshop/setup" className="btn btn-secondary">
              Jump to Workshop
            </Link>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Your Progress</h2>
          <div className="progress-cards-grid">
            {workshopSections.map((section) => (
              <ProgressCard key={section.title} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Who Is This For?</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">👩‍💻</div>
              <h3>Software Engineers</h3>
              <p>
                Developers who want to leverage GitHub Copilot to speed up test
                creation while maintaining production-quality standards.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🔍</div>
              <h3>QA &amp; Test Automation Engineers</h3>
              <p>
                SDETs and QA professionals exploring how GenAI tooling fits into
                existing test automation workflows and quality gates.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">⚙️</div>
              <h3>DevOps / Platform Engineers</h3>
              <p>
                Engineers responsible for CI/CD pipelines who need to govern
                AI-generated code and integrate quality gates team-wide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Learnings */}
      <section className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title">Key Learnings</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">🎯</div>
              <h3>Where Copilot Adds Value</h3>
              <p>
                Understand where GitHub Copilot is effective in testing—and
                where human judgment is still essential.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">⚡</div>
              <h3>Generate &amp; Refactor Tests</h3>
              <p>
                Practical techniques to generate, refactor, and improve unit,
                API, and integration tests using GenAI responsibly.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🛡️</div>
              <h3>Review &amp; Validate AI Output</h3>
              <p>
                Techniques to review AI-generated test code and catch false
                confidence, flaky tests, and security risks.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🔒</div>
              <h3>Define Guardrails</h3>
              <p>
                How to define guardrails for quality, security, and consistency
                when using Copilot across a team.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🚀</div>
              <h3>Integrate into CI/CD</h3>
              <p>
                How to integrate AI-assisted testing into CI/CD pipelines
                without increasing risk or reducing confidence.
              </p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">👥</div>
              <h3>Team Adoption</h3>
              <p>
                Best practices for rolling out AI-assisted testing tooling
                across engineering teams at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Journey */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Workshop Journey</h2>
          <p className="section-description">
            Follow these 11 steps across four parts:
          </p>
          <div className="journey-grid">
            {[
              {
                step: '1',
                title: 'Environment Setup',
                desc: 'Verify Copilot in VS Code, clone starter repo, first inline suggestion',
                path: '/workshop/setup',
              },
              {
                step: '2',
                title: 'Introduction to GitHub Copilot',
                desc: 'Tokens, interaction modes, slash commands, MCP, skills, and customization files',
                path: '/workshop/copilot-intro',
              },
              {
                step: '3',
                title: 'Copilot: The Big Picture',
                desc: 'Where Copilot adds value, where it does not, and the trust model',
                path: '/workshop/copilot-overview',
              },
              {
                step: '4',
                title: 'Unit Test Generation',
                desc: 'Prompt patterns, generate → review → fix loop, spotting flaky tests',
                path: '/workshop/unit-testing',
              },
              {
                step: '5',
                title: 'API & Integration Tests',
                desc: 'REST API test scaffolding, reviewing generated assertions, edge cases',
                path: '/workshop/api-integration',
              },
              {
                step: '6',
                title: 'Test Data & Mocks',
                desc: 'Fixture factories, mock stubs, and safe test data generation',
                path: '/workshop/test-data-mocks',
              },
              {
                step: '7',
                title: 'Reviewing Tests & Guardrails',
                desc: 'Review checklists, validating AI output, security red flags',
                path: '/workshop/reviewing-tests',
              },
              {
                step: '8',
                title: 'CI/CD & Team Adoption',
                desc: 'Quality gates, security scanning, and team-wide onboarding',
                path: '/workshop/cicd-adoption',
              },
              {
                step: '9',
                title: 'E2E Testing with Playwright',
                desc: 'Page Object Model, locator strategies, fixtures, and CI integration',
                path: '/workshop/e2e-playwright',
              },
              {
                step: '10',
                title: 'Component Testing with RTL',
                desc: 'Accessible queries, user-event, mocking hooks and context providers',
                path: '/workshop/component-testing',
              },
              {
                step: '11',
                title: 'Testing AI-Powered Features',
                desc: 'Non-deterministic output, prompt injection, and agentic workflow testing',
                path: '/workshop/ai-testing-patterns',
              },
            ].map((item) => (
              <Link to={item.path} key={item.step} className="journey-card">
                <span className="journey-step">{item.step}</span>
                <div>
                  <h3 className="journey-title">{item.title}</h3>
                  <p className="journey-desc">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="section section-alt">
        <div className="section-inner">
          <h2 className="section-title">120-Minute Schedule</h2>
          <p style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0.7 }}>Friday, 10 Jul 2026 · Room R2 · 12:15 pm – 2:15 pm WEDT (UTC+02:00)</p>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Topic</th>
                <th>Description</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>12:15</td>
                <td>Welcome &amp; Setup</td>
                <td>Introductions, prerequisites check, Copilot activation</td>
                <td>10 min</td>
              </tr>
              <tr>
                <td>12:25</td>
                <td>Step 1 — Environment Setup</td>
                <td>Verify Copilot, clone starter repo, first suggestion exercise</td>
                <td>15 min</td>
              </tr>
              <tr>
                <td>12:40</td>
                <td>Step 2 — Introduction to GitHub Copilot</td>
                <td>Tokens, modes, slash commands, MCP, skills, customization files</td>
                <td>25 min</td>
              </tr>
              <tr>
                <td>13:05</td>
                <td>Step 3 — Copilot: The Big Picture</td>
                <td>Value map, risk model, where human judgment is still required</td>
                <td>20 min</td>
              </tr>
              <tr className="schedule-break">
                <td>13:25</td>
                <td>⚡ Part 2 begins</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>13:25</td>
                <td>Step 4 — Unit Test Generation</td>
                <td>Prompt patterns, generate → review → fix loop, flaky test detection</td>
                <td>25 min</td>
              </tr>
              <tr>
                <td>13:50</td>
                <td>Step 5 — API &amp; Integration Tests</td>
                <td>REST test scaffolding, assertion review, integration coverage</td>
                <td>20 min</td>
              </tr>
              <tr>
                <td>14:10</td>
                <td>Step 6 — Test Data &amp; Mocks</td>
                <td>Fixture factories, stubs, avoiding hardcoded secrets</td>
                <td>15 min</td>
              </tr>
              <tr className="schedule-break">
                <td>14:25</td>
                <td>🛡️ Part 3 begins</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>14:25</td>
                <td>Step 7 — Reviewing Tests &amp; Guardrails</td>
                <td>Review checklist, false confidence, security red flags, prompt templates</td>
                <td>20 min</td>
              </tr>
              <tr>
                <td>14:45</td>
                <td>Step 8 — CI/CD &amp; Team Adoption</td>
                <td>Quality gates, scanning, CODEOWNERS, team onboarding strategies</td>
                <td>15 min</td>
              </tr>
              <tr className="schedule-break">
                <td>15:00</td>
                <td>🎤 Wrap-up &amp; Q&amp;A</td>
                <td>Key takeaways, resources, open discussion</td>
                <td>15 min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Home;
