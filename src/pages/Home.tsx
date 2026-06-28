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
            Five hands-on exercises across 120 minutes:
          </p>
          <div className="journey-grid">
            {[
              {
                step: '⚙️',
                title: 'Intro, Setup & Tour',
                desc: 'Activate Copilot, clone the exercises repo, and tour the checkout pipeline (User → Cart → Discount → Fraud → Payment → Notification)',
                path: '/workshop/setup',
              },
              {
                step: 'A',
                title: 'Unit Tests',
                desc: 'Generate tests for calculateDiscount(); weak vs strong prompts; expose all 3 bugs',
                path: '/workshop/unit-testing',
              },
              {
                step: 'B',
                title: 'Review AI Tests',
                desc: 'Read the weak test file, identify false confidence, rewrite with strong assertions',
                path: '/workshop/reviewing-tests',
              },
              {
                step: 'C',
                title: 'API Tests',
                desc: 'Supertest for the full checkout pipeline with domain-rules.md as Copilot context',
                path: '/workshop/api-integration',
              },
              {
                step: 'D',
                title: 'Component Tests',
                desc: 'StorePage RTL tests hands-on; Playwright checkout flow shown as live demo',
                path: '/workshop/component-testing',
              },
              {
                step: 'E',
                title: 'CI Guardrails',
                desc: 'Coverage gates, flaky test demo, copilot-instructions.md, context engineering',
                path: '/workshop/cicd-adoption',
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
                <td>Intro, Setup &amp; Tour</td>
                <td>Introductions, prerequisites check, Copilot activation, pipeline walkthrough</td>
                <td>15 min</td>
              </tr>
              <tr>
                <td>12:30</td>
                <td>Exercise A — Unit Tests</td>
                <td>Generate tests for <code>calculateDiscount()</code>; discover that weak prompts produce weak tests</td>
                <td>25 min</td>
              </tr>
              <tr>
                <td>12:55</td>
                <td>Exercise B — Review AI Tests</td>
                <td>Read the weak test file; identify what passes but shouldn't; rewrite with strong assertions</td>
                <td>10 min</td>
              </tr>
              <tr>
                <td>13:05</td>
                <td>Exercise C — API Tests</td>
                <td>Supertest for the full checkout pipeline; use domain-rules.md as Copilot context</td>
                <td>25 min</td>
              </tr>
              <tr>
                <td>13:30</td>
                <td>Exercise D — Component Tests</td>
                <td>StorePage RTL tests hands-on; Playwright shown as live demo / optional extra</td>
                <td>20 min</td>
              </tr>
              <tr>
                <td>13:50</td>
                <td>Exercise E — CI Guardrails</td>
                <td>Coverage gates, flaky test demo, <code>.github/copilot-instructions.md</code>, context engineering</td>
                <td>10 min</td>
              </tr>
              <tr className="schedule-break">
                <td>14:00</td>
                <td>🎤 Wrap-up &amp; Q&amp;A</td>
                <td>Trust Playbook walkthrough, one action to take back, open discussion</td>
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
