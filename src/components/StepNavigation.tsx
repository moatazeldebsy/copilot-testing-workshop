import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { allSteps } from '../data/workshopSteps';
import { useProgressContext } from '../context/ProgressContext';
import './StepNavigation.css';

const StepNavigation: React.FC = () => {
  const { pathname } = useLocation();
  const { isComplete, toggleComplete } = useProgressContext();
  const currentIndex = allSteps.findIndex((s) => s.path === pathname);

  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
  const next = currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;
  const done = isComplete(pathname);

  return (
    <div className="step-nav-wrapper">
      <button
        className={`step-nav-complete ${done ? 'step-nav-complete--done' : ''}`}
        onClick={() => toggleComplete(pathname)}
        type="button"
      >
        {done ? '✓ Completed' : 'Mark as Complete'}
      </button>
      <nav className="step-nav">
        {prev ? (
          <Link to={prev.path} className="step-nav-link step-nav-prev">
            <span className="step-nav-arrow">←</span>
            <span className="step-nav-meta">
              <span className="step-nav-direction">Previous</span>
              <span className="step-nav-label">{prev.label}</span>
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link to={next.path} className="step-nav-link step-nav-next">
            <span className="step-nav-meta">
              <span className="step-nav-direction">Next</span>
              <span className="step-nav-label">{next.label}</span>
            </span>
            <span className="step-nav-arrow">→</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
};

export default StepNavigation;
