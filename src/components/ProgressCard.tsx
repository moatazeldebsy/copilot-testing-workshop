import React, { useState } from 'react';
import { useProgressContext } from '../context/ProgressContext';
import { WorkshopSection } from '../data/workshopSteps';
import './ProgressCard.css';

interface ProgressCardProps {
  section: WorkshopSection;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isComplete } = useProgressContext();
  const completableItems = section.items.filter((item) => item.path !== '/');

  const completed = completableItems.filter((item) => isComplete(item.path)).length;
  const total = completableItems.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-card">
      <button
        className="progress-card-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="progress-card-info">
          <h3 className="progress-card-title">{section.title}</h3>
          <p className="progress-card-subtitle">
            {total} {total === 1 ? 'Lesson' : 'Lessons'}
          </p>
        </div>
        <div className="progress-card-percentage">
          <svg className="progress-circle" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-circle-bg"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-circle-fill"
              style={{
                strokeDasharray: `${(percentage / 100) * 283} 283`,
              }}
            />
          </svg>
          <span className="progress-circle-text">{percentage}%</span>
        </div>
        <span className={`progress-card-chevron ${isOpen ? 'open' : ''}`}>
          ▲
        </span>
      </button>

      {isOpen && (
        <div className="progress-card-content">
          <ul className="progress-card-items">
            {completableItems.map((item) => {
              const completed = isComplete(item.path);
              return (
                <li key={item.path} className="progress-card-item">
                  <input
                    type="checkbox"
                    id={`progress-${item.path}`}
                    checked={completed}
                    onChange={() => {}}
                    className="progress-card-checkbox"
                  />
                  <label htmlFor={`progress-${item.path}`} className="progress-card-label">
                    {item.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
