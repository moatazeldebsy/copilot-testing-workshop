import React, { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import ProgressCard from '@site/src/components/ProgressCard';
import { workshopSections } from '@site/src/data/workshopSteps';
import styles from './index.module.css';

const CODESPACES_URL = 'https://codespaces.new/moatazeldebsy/copilot-testing-workshop?quickstart=1';

const TYPED = 'expect(';
const GHOST = 'result.finalTotal).toBe(90);';

type Phase = 'typing' | 'ghost' | 'accepted';

// The hero shows the moment the workshop is about: Copilot proposing an
// assertion, and the reader deciding whether it is precise enough to accept.
function useSuggestionDemo(): { typed: string; phase: Phase } {
  const [typed, setTyped] = useState(TYPED);
  const [phase, setPhase] = useState<Phase>('accepted');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timers: number[] = [];
    setTyped('');
    setPhase('typing');
    TYPED.split('').forEach((_, i) => {
      timers.push(window.setTimeout(() => setTyped(TYPED.slice(0, i + 1)), 600 + i * 90));
    });
    const typedAt = 600 + TYPED.length * 90;
    timers.push(window.setTimeout(() => setPhase('ghost'), typedAt + 350));
    timers.push(window.setTimeout(() => setPhase('accepted'), typedAt + 2600));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return { typed, phase };
}

function EditorDemo(): ReactNode {
  const { typed, phase } = useSuggestionDemo();

  return (
    <figure className={styles.editor} aria-label="Copilot suggesting a Jest assertion in calculateDiscount.test.ts">
      <div className={styles.editorTabs}>
        <span className={styles.editorTab}>calculateDiscount.test.ts</span>
      </div>
      <pre className={styles.editorCode}>
        <code>
          <span className={styles.ln}>1</span><span className={styles.kw}>import</span> {'{ calculateDiscount }'} <span className={styles.kw}>from</span> <span className={styles.str}>'../../src/services/calculateDiscount'</span>;{'\n'}
          <span className={styles.ln}>2</span>{'\n'}
          <span className={styles.ln}>3</span><span className={styles.fn}>describe</span>(<span className={styles.str}>'calculateDiscount'</span>, () =&gt; {'{'}{'\n'}
          <span className={styles.ln}>4</span>{'  '}<span className={styles.fn}>it</span>(<span className={styles.str}>'SAVE10 deducts exactly 10% of the subtotal'</span>, () =&gt; {'{'}{'\n'}
          <span className={styles.ln}>5</span>{'    '}<span className={styles.kw}>const</span> result = <span className={styles.fn}>calculateDiscount</span>({'{'} subtotal: <span className={styles.num}>100</span>, code: <span className={styles.str}>'SAVE10'</span> {'}'});{'\n'}
          <span className={styles.ln}>6</span>{'    '}
          <span className={styles.fn}>{typed.slice(0, 6)}</span>{typed.slice(6)}
          {phase === 'typing' && <span className={styles.caret} />}
          {phase !== 'typing' && (
            <span className={clsx(phase === 'ghost' ? styles.ghost : styles.accepted)}>
              <span>result.finalTotal</span>).<span className={phase === 'accepted' ? styles.fn : undefined}>toBe</span>(<span className={phase === 'accepted' ? styles.num : undefined}>90</span>);
            </span>
          )}
          {phase === 'accepted' && <span className={styles.caret} />}
          {'\n'}
          <span className={styles.ln}>7</span>{'  '}{'}'});{'\n'}
          <span className={styles.ln}>8</span>{'}'});
        </code>
      </pre>
      <figcaption className={styles.editorStatus}>
        <span className={styles.copilotDot} aria-hidden="true" />
        {phase === 'ghost' ? (
          <span>
            Suggestion: <code>{GHOST}</code> <kbd>Tab</kbd> to accept
          </span>
        ) : phase === 'accepted' ? (
          <span>Accepted: an exact value, not <code>toBeTruthy()</code></span>
        ) : (
          <span>Copilot is reading the test…</span>
        )}
      </figcaption>
    </figure>
  );
}

const pipeline = ['User', 'Cart', 'Discount', 'Fraud', 'Payment', 'Notification'];

const timeline = [
  { time: '12:15', step: '0', title: 'Intro, setup & tour', desc: 'Activate Copilot, clone the exercises repo and walk the checkout pipeline.', minutes: 15, path: '/workshop/setup' },
  { time: '12:30', step: 'A', title: 'Unit tests', desc: 'Generate tests for calculateDiscount(). Weak prompts miss the three hidden bugs; strong prompts expose them.', minutes: 25, path: '/workshop/unit-testing' },
  { time: '12:55', step: 'B', title: 'Review AI tests', desc: 'Find the tests that pass but shouldn\'t, then rewrite them with exact assertions.', minutes: 10, path: '/workshop/reviewing-tests' },
  { time: '13:05', step: 'C', title: 'API tests', desc: 'Supertest coverage for the full checkout pipeline, with domain-rules.md as Copilot context.', minutes: 25, path: '/workshop/api-integration' },
  { time: '13:30', step: 'D', title: 'Component & E2E tests', desc: 'React Testing Library for StorePage, plus the Playwright checkout flow.', minutes: 20, path: '/workshop/component-testing' },
  { time: '13:50', step: 'E', title: 'CI guardrails', desc: 'Coverage gates, a flaky test demo and copilot-instructions.md.', minutes: 10, path: '/workshop/cicd-adoption' },
  { time: '14:00', step: '✓', title: 'Wrap-up & Q&A', desc: 'The trust framework, one action to take back, open discussion.', minutes: 15, path: '/workshop/takeaways' },
];

const audiences = [
  { title: 'Software engineers', desc: 'Speed up test creation with Copilot while keeping production-quality standards.' },
  { title: 'QA & test automation engineers', desc: 'See where GenAI tooling fits into existing automation workflows and quality gates.' },
  { title: 'DevOps & platform engineers', desc: 'Govern AI-generated code and wire quality gates into CI/CD team-wide.' },
];

const learnings = [
  'Where Copilot adds value in testing, and where human judgment is still essential',
  'Generate and refactor unit, API and integration tests responsibly',
  'Review AI-generated tests for false confidence, flakiness and security risks',
  'Define guardrails for quality, security and consistency across a team',
  'Bring AI-assisted testing into CI/CD without lowering confidence',
  'Roll out AI-assisted testing across engineering teams',
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="GenAI in Testing"
      description="Hands-on workshop: use GitHub Copilot to accelerate testing without losing trust. WeAreDevelopers Berlin 2026.">
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroGrid)}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEvent}>WeAreDevelopers Berlin 2026, 120-minute hands-on workshop</p>
            <h1 className={styles.heroTitle}>GenAI in Testing</h1>
            <p className={styles.heroSubtitle}>Using GitHub Copilot to accelerate quality without losing trust.</p>
            <p className={styles.heroBody}>
              Generate unit, API, component and end-to-end tests with Copilot, then learn to spot the ones that
              pass for the wrong reasons, and build the guardrails that keep your team's suite honest.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to="/prerequisites">
                Start the workshop
              </Link>
              <Link className="button button--secondary button--lg" href={CODESPACES_URL}>
                Open in Codespaces
              </Link>
            </div>
          </div>
          <EditorDemo />
        </div>
      </header>

      <main>
        <section className={styles.pipelineSection} aria-labelledby="pipeline-heading">
          <div className="container">
            <h2 id="pipeline-heading" className={styles.pipelineHeading}>
              One system under test, every exercise
            </h2>
            <ol className={styles.pipeline}>
              {pipeline.map((stage) => (
                <li key={stage}>
                  <span>{stage}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="timeline-heading">
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 id="timeline-heading">The 120 minutes</h2>
              <p>Friday, 10 July 2026, Room R2, 12:15–14:15 CEST</p>
            </div>
            <ol className={styles.timeline}>
              {timeline.map((item) => (
                <li key={item.step}>
                  <Link to={item.path} className={styles.timelineRow}>
                    <span className={styles.timelineTime}>{item.time}</span>
                    <span className={styles.timelineStep}>{item.step}</span>
                    <span className={styles.timelineBody}>
                      <span className={styles.timelineTitle}>{item.title}</span>
                      <span className={styles.timelineDesc}>{item.desc}</span>
                    </span>
                    <span className={styles.timelineMinutes}>{item.minutes} min</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className={styles.timelineNote}>
              Copilot has changed since the session. <Link to="/whats-new">See what's new from July to October 2026</Link>{' '}
              and how it affects each exercise.
            </p>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)} aria-labelledby="progress-heading">
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 id="progress-heading">Your progress</h2>
              <p>Saved in this browser as you mark steps complete and answer quiz checks.</p>
            </div>
            <div className={styles.progressGrid}>
              {workshopSections
                .filter((section) => section.items.some((item) => item.path !== '/'))
                .map((section) => (
                  <ProgressCard key={section.title} section={section} />
                ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="audience-heading">
          <div className={clsx('container', styles.split)}>
            <div>
              <h2 id="audience-heading">Who it's for</h2>
              <ul className={styles.audience}>
                {audiences.map((a) => (
                  <li key={a.title}>
                    <strong>{a.title}</strong>
                    <span>{a.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>What you'll take away</h2>
              <ul className={styles.learnings}>
                {learnings.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
