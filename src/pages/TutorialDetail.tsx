import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '../components/Layout';
import './TutorialDetail.css';

import gettingStartedMd from '../../docs/tutorials/getting-started.md?raw';
import advancedScenariosMd from '../../docs/tutorials/advanced-scenarios.md?raw';
import mcpPracticeMd from '../../docs/tutorials/mcp-skills-practice.md?raw';
import facilitatorCheatSheetMd from '../../docs/tutorials/facilitator-cheat-sheet.md?raw';

type TutorialDoc = {
  title: string;
  markdown: string;
};

const tutorialDocs: Record<string, TutorialDoc> = {
  'getting-started': {
    title: 'Getting Started with Copilot for Testing',
    markdown: gettingStartedMd,
  },
  'advanced-scenarios': {
    title: 'Advanced Scenarios',
    markdown: advancedScenariosMd,
  },
  'mcp-skills-practice': {
    title: 'MCP, Skills, and copilot.md Practice',
    markdown: mcpPracticeMd,
  },
  'facilitator-cheat-sheet': {
    title: 'Facilitator Cheat Sheet',
    markdown: facilitatorCheatSheetMd,
  },
};

const TutorialDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const normalizedSlug = slug.replace(/\.md$/i, '');
  const doc = tutorialDocs[normalizedSlug];

  if (!doc) {
    return (
      <Layout>
        <div className="workshop-page">
          <h1>Tutorial Not Found</h1>
          <p className="page-lead">The tutorial you requested does not exist.</p>
          <p>
            <Link to="/tutorials">Return to tutorials</Link>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="workshop-page tutorial-doc">
        <p className="tutorial-doc__back-link">
          <Link to="/tutorials">← Back to tutorials</Link>
        </p>
        <div className="tutorial-doc__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.markdown}</ReactMarkdown>
        </div>
      </article>
    </Layout>
  );
};

export default TutorialDetail;
