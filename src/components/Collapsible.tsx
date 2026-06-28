import React, { useId, useState } from 'react';
import './Collapsible.css';

interface CollapsibleProps {
  title: string;
  variant?: 'hint' | 'solution' | 'bonus';
  children: React.ReactNode;
}

const variantIcons: Record<string, string> = {
  hint: '💡',
  solution: '✅',
  bonus: '🌟',
};

const Collapsible: React.FC<CollapsibleProps> = ({ title, variant = 'hint', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <details
      className={`collapsible collapsible--${variant}`}
      role="group"
      onToggle={(event) => setIsOpen((event.currentTarget as HTMLDetailsElement).open)}
    >
      <summary
        className="collapsible-summary"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="collapsible-icon">{variantIcons[variant]}</span>
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-chevron" />
      </summary>
      <div id={contentId} className="collapsible-content" role="region" aria-label={title}>
        {children}
      </div>
    </details>
  );
};

export default Collapsible;
