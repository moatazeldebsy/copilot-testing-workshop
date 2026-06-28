import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { allSteps, workshopSections } from '../data/workshopSteps';
import { useProgressContext } from '../context/ProgressContext';
import Search from './Search';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const {
    isComplete,
    markComplete,
    completedCount,
    quizCompletedCount,
    totalSteps,
    totalQuizChecks,
    completionUnitsDone,
    completionUnitsTotal,
    unifiedPct,
    resetQuizProgress,
  } = useProgressContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isFacilitatorMode = searchParams.get('facilitator') === 'true';
  const currentIndex = allSteps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentIndex >= 0 ? allSteps[currentIndex] : null;
  const nextStep = currentIndex >= 0 && currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

  const pacingHint = unifiedPct < 35
    ? 'Kick off with a short demo, then move quickly into guided hands-on.'
    : unifiedPct < 75
      ? 'Pause for a checkpoint and verify participant outputs before advancing.'
      : 'Start debrief prompts and prepare final Q&A wrap-up.';

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        className={`sidebar-hamburger ${open ? 'sidebar-hamburger--open' : ''}`}
        onClick={() => setOpen(!open)}
        type="button"
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <nav className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-logo">
            <span className="sidebar-logo-icon">🤖</span>
            <span className="sidebar-logo-text">Copilot Testing</span>
          </NavLink>
          <ThemeToggle />
        </div>
        <Search />
        <div className="sidebar-progress">
          <div className="sidebar-progress-info">
            <span>{completionUnitsDone}/{completionUnitsTotal} overall</span>
            <span>{unifiedPct}%</span>
          </div>
          <div className="sidebar-progress-secondary-row">
            <span className="sidebar-progress-secondary">
              Steps: {completedCount}/{totalSteps} | Quiz checks: {quizCompletedCount}/{totalQuizChecks}
            </span>
            <button
              type="button"
              className="sidebar-progress-reset"
              onClick={() => {
                const shouldReset = window.confirm(
                  'Reset quiz check progress for this browser session?'
                );

                if (shouldReset) {
                  resetQuizProgress();
                }
              }}
            >
              Reset Quiz Checks
            </button>
          </div>
          <div className="sidebar-progress-bar">
            <div className="sidebar-progress-fill" style={{ width: `${unifiedPct}%` }} />
          </div>
        </div>
        {isFacilitatorMode && (
          <div className="sidebar-facilitator" role="status" aria-live="polite">
            <div className="sidebar-facilitator__title">Facilitator cue</div>
            <div className="sidebar-facilitator__row">
              <span className="sidebar-facilitator__label">Now</span>
              <span className="sidebar-facilitator__value">{currentStep?.label ?? 'Workshop overview'}</span>
            </div>
            <div className="sidebar-facilitator__row">
              <span className="sidebar-facilitator__label">Next</span>
              <span className="sidebar-facilitator__value">{nextStep?.label ?? 'Closing'}</span>
            </div>
            <p className="sidebar-facilitator__hint">{pacingHint}</p>
            <div className="sidebar-facilitator__actions">
              <button
                type="button"
                className="sidebar-facilitator__button"
                disabled={!currentStep || isComplete(currentStep.path)}
                onClick={() => {
                  if (currentStep && !isComplete(currentStep.path)) {
                    markComplete(currentStep.path);
                  }
                }}
              >
                Mark Current Complete
              </button>
              <button
                type="button"
                className="sidebar-facilitator__button"
                disabled={!nextStep}
                onClick={() => {
                  if (nextStep) {
                    navigate(`${nextStep.path}${location.search}`);
                  }
                }}
              >
                Jump To Next Step
              </button>
            </div>
          </div>
        )}
        <div className="sidebar-content">
          {workshopSections.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              <h3 className="sidebar-section-title">{section.title}</h3>
              <ul className="sidebar-list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
                      }
                    >
                      {item.step && <span className="sidebar-step">{item.step}</span>}
                      <span className="sidebar-link-label">{item.label}</span>
                      {item.path !== '/' && isComplete(item.path) && (
                        <span className="sidebar-check">✓</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
