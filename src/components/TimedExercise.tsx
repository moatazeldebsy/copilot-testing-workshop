import React from 'react';
import './TimedExercise.css';

interface TimedExerciseProps {
  minutes: number;
  title: string;
  children: React.ReactNode;
}

const TimedExercise: React.FC<TimedExerciseProps> = ({ minutes, title, children }) => (
  <div className="timed-exercise">
    <div className="timed-exercise__header">
      <div className="timed-exercise__title-row">
        <span className="timed-exercise__icon">🏋️</span>
        <span className="timed-exercise__title">{title}</span>
      </div>
      <span className="timed-exercise__badge">
        <span className="timed-exercise__clock">⏱</span>
        {minutes} min
      </span>
    </div>
    <div className="timed-exercise__body">{children}</div>
  </div>
);

export default TimedExercise;
