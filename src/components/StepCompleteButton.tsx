import React from 'react';
import { useProgressContext } from '../context/ProgressContext';
import { useCurrentStep } from '../hooks/useCurrentStep';
import './WorkshopChrome.css';

const StepCompleteButton: React.FC = () => {
  const { current } = useCurrentStep();
  const { isComplete, toggleComplete } = useProgressContext();

  if (!current) {
    return null;
  }

  const done = isComplete(current.path);

  return (
    <div className={`step-complete ${done ? 'step-complete--done' : ''}`}>
      <span className="step-complete__text">
        {done ? 'You finished this step.' : 'Done with this step? Mark it to track your progress.'}
      </span>
      <button
        type="button"
        className={`button button--sm ${done ? 'button--secondary' : 'button--primary'}`}
        aria-pressed={done}
        onClick={() => toggleComplete(current.path)}>
        {done ? 'Mark as not done' : 'Mark step complete'}
      </button>
    </div>
  );
};

export default StepCompleteButton;
