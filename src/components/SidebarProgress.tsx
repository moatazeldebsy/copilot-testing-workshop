import React from 'react';
import { useHistory } from '@docusaurus/router';
import { useProgressContext } from '../context/ProgressContext';
import { useFacilitatorMode } from '../hooks/useFacilitator';
import { useCurrentStep } from '../hooks/useCurrentStep';
import './WorkshopChrome.css';

const SidebarProgress: React.FC = () => {
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
  const { enabled: isFacilitatorMode } = useFacilitatorMode();
  const { current, next } = useCurrentStep();
  const history = useHistory();

  const pacingHint = unifiedPct < 35
    ? 'Kick off with a short demo, then move quickly into guided hands-on.'
    : unifiedPct < 75
      ? 'Pause for a checkpoint and verify participant outputs before advancing.'
      : 'Start debrief prompts and prepare final Q&A wrap-up.';

  return (
    <div className="sidebar-progress">
      <div className="sidebar-progress__row">
        <span className="sidebar-progress__label">Your progress</span>
        <span className="sidebar-progress__pct">{unifiedPct}%</span>
      </div>
      <div
        className="sidebar-progress__bar"
        role="progressbar"
        aria-valuenow={unifiedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Workshop progress">
        <div className="sidebar-progress__fill" style={{ width: `${unifiedPct}%` }} />
      </div>
      <div className="sidebar-progress__row sidebar-progress__row--meta">
        <span>
          {completedCount}/{totalSteps} steps, {quizCompletedCount}/{totalQuizChecks} quiz checks ({completionUnitsDone}/{completionUnitsTotal})
        </span>
        <button
          type="button"
          className="sidebar-progress__reset"
          onClick={() => {
            if (window.confirm('Reset quiz check progress for this browser?')) {
              resetQuizProgress();
            }
          }}>
          Reset quiz
        </button>
      </div>

      {isFacilitatorMode && (
        <div className="sidebar-facilitator" role="status" aria-live="polite">
          <div className="sidebar-facilitator__title">Facilitator cue</div>
          <dl>
            <dt>Now</dt>
            <dd>{current?.label ?? 'Workshop overview'}</dd>
            <dt>Next</dt>
            <dd>{next?.label ?? 'Closing'}</dd>
          </dl>
          <p className="sidebar-facilitator__hint">{pacingHint}</p>
          <div className="sidebar-facilitator__actions">
            <button
              type="button"
              className="button button--sm button--secondary"
              disabled={!current || isComplete(current.path)}
              onClick={() => current && markComplete(current.path)}>
              Mark current complete
            </button>
            <button
              type="button"
              className="button button--sm button--primary"
              disabled={!next}
              onClick={() => next && history.push(next.path)}>
              Jump to next step
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarProgress;
