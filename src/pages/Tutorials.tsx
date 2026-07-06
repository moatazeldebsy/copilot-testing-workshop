import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

type TutorialItem = {
  title: string;
  description: string;
  slug: string;
};

const Tutorials: React.FC = () => {
  const tutorials: TutorialItem[] = [
    {
      title: 'Advanced Scenarios',
      description: 'Guardrail prompt templates, CI/CD integration with quality gates and secret scanning, and team adoption patterns.',
      slug: 'advanced-scenarios',
    },
    {
      title: 'MCP, Skills, and copilot.md Practice',
      description: 'Hands-on guide for MCP server setup, skill-based workflows, and prompt drills using the workshop-exercises repository.',
      slug: 'mcp-skills-practice',
    },
  ];

  return (
    <Layout>
      <div className="workshop-page">
        <h1>Tutorials</h1>
        <p className="page-lead">
          Reference guides to complement the hands-on workshop steps.
        </p>

        <table className="info-table">
          <thead>
            <tr>
              <th>Tutorial</th>
              <th>Description</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map((tutorial) => (
              <tr key={tutorial.slug}>
                <td><strong>{tutorial.title}</strong></td>
                <td>{tutorial.description}</td>
                <td>
                  <Link to={`/tutorials/${tutorial.slug}`}>Read tutorial →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Tutorials;
