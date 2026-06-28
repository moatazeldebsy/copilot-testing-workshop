import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import './LanguageTabs.css';

export interface LanguageTab {
  label: string;
  language: string;
  code: string;
}

interface LanguageTabsProps {
  tabs: LanguageTab[];
}

const LanguageTabs: React.FC<LanguageTabsProps> = ({ tabs }) => {
  const [selected, setSelected] = useState(0);
  const active = tabs[selected];

  return (
    <div className="lang-tabs">
      <div className="lang-tabs__bar" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === selected}
            className={`lang-tabs__tab${i === selected ? ' lang-tabs__tab--active' : ''}`}
            onClick={() => setSelected(i)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock language={active.language}>{active.code}</CodeBlock>
    </div>
  );
};

export default LanguageTabs;
