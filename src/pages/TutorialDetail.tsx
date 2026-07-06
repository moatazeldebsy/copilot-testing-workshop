import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';
import './TutorialDetail.css';

import advancedScenariosMd from '../../docs/tutorials/advanced-scenarios.md?raw';
import mcpPracticeMd from '../../docs/tutorials/mcp-skills-practice.md?raw';

type TutorialDoc = {
  title: string;
  markdown: string;
};

const tutorialDocs: Record<string, TutorialDoc> = {
  'advanced-scenarios': {
    title: 'Advanced Scenarios',
    markdown: advancedScenariosMd,
  },
  'mcp-skills-practice': {
    title: 'MCP, Skills, and copilot.md Practice',
    markdown: mcpPracticeMd,
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre: ({ children }) => <>{children}</>,
              code: ({ className, children }) => {
                const match = /language-(\w+)/.exec(className || '');
                const text = String(children).replace(/\n$/, '');
                if (match) {
                  return <CodeBlock language={match[1]}>{text}</CodeBlock>;
                }
                return <code className={className}>{children}</code>;
              },
            }}
          >
            {doc.markdown}
          </ReactMarkdown>
        </div>
      </article>
    </Layout>
  );
};

export default TutorialDetail;
