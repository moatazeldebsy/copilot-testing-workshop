import React from 'react';
import Details from '@theme/Details';
import './Collapsible.css';

interface CollapsibleProps {
  title: string;
  variant?: 'hint' | 'solution' | 'bonus';
  children: React.ReactNode;
}

const variantLabels: Record<NonNullable<CollapsibleProps['variant']>, string> = {
  hint: 'Hint',
  solution: 'Solution',
  bonus: 'Bonus',
};

const Collapsible: React.FC<CollapsibleProps> = ({ title, variant = 'hint', children }) => {
  // Titles often already start with "Hint:"/"Solution:"; don't repeat it in the pill.
  const label = variantLabels[variant];
  const cleanTitle = title.replace(new RegExp(`^${label}\\s*[:—-]\\s*`, 'i'), '');

  return (
    <Details
      className={`collapsible collapsible--${variant}`}
      summary={
        <summary>
          <span className={`collapsible-pill collapsible-pill--${variant}`}>{label}</span>
          <span className="collapsible-title">{cleanTitle}</span>
        </summary>
      }
    >
      {children}
    </Details>
  );
};

export default Collapsible;
