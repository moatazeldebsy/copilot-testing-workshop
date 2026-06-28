import React from 'react';
import './PageMeta.css';

interface PageMetaProps {
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const difficultyConfig: Record<string, { label: string; icon: string }> = {
  beginner: { label: 'Beginner', icon: '🟢' },
  intermediate: { label: 'Intermediate', icon: '🟡' },
  advanced: { label: 'Advanced', icon: '🔴' },
};

const PageMeta: React.FC<PageMetaProps> = ({ duration, difficulty }) => {
  const diff = difficultyConfig[difficulty];
  return (
    <div className="page-meta">
      <span className="page-meta-badge page-meta-time">
        <span className="page-meta-icon">⏱</span> {duration}
      </span>
      <span className={`page-meta-badge page-meta-difficulty page-meta-difficulty--${difficulty}`}>
        <span className="page-meta-icon">{diff.icon}</span> {diff.label}
      </span>
    </div>
  );
};

export default PageMeta;
