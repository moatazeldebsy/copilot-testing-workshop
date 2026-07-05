import React from 'react';
import { exerciseRepository, getWorkshopStep } from '../data/workshopSteps';
import './ExerciseRepoCallout.css';

interface ExerciseRepoCalloutProps {
  path: string;
  title?: string;
}

const ExerciseRepoCallout: React.FC<ExerciseRepoCalloutProps> = ({
  path,
  title = 'Practice repo for this step',
}) => {
  const step = getWorkshopStep(path);

  if (!step?.exercise) {
    return null;
  }

  const { exercise } = step;

  return (
    <div className="exercise-repo-callout callout callout-info">
      <div className="exercise-repo-callout__header">
        <strong>{title}</strong>
        <span className="exercise-repo-callout__badge">{exercise.stepLabel}</span>
      </div>

      <p>
        Work from <code>{exerciseRepository.defaultBranch}</code> in{' '}
        <a href={exerciseRepository.url} target="_blank" rel="noreferrer">
          {exerciseRepository.name}
        </a>
        . Use the solution checkpoints only if you need to catch up or compare your
        result after the exercise.
      </p>

      <div className="exercise-repo-callout__meta">
        <div className="exercise-repo-callout__card">
          <span className="exercise-repo-callout__card-label">Participant goal</span>
          <span>{exercise.participantGoal}</span>
        </div>
        <div className="exercise-repo-callout__card">
          <span className="exercise-repo-callout__card-label">Run command</span>
          <code>{exercise.runCommand}</code>
        </div>
      </div>

      <p>
        <strong>Primary files</strong>
      </p>
      <ul className="exercise-repo-callout__files">
        {exercise.primaryFiles.map((file) => (
          <li key={file}>
            <code>{file}</code>
          </li>
        ))}
      </ul>

      {exercise.solutionCheckpoints.length > 0 && (
        <>
          <p>
            <strong>Recovery checkpoint</strong>
          </p>
          <ul className="exercise-repo-callout__checkpoints">
            {exercise.solutionCheckpoints.map((checkpoint) => (
              <li key={checkpoint}>
                <code>{checkpoint}</code>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="exercise-repo-callout__links">
        <a
          className="exercise-repo-callout__link"
          href={exerciseRepository.url}
          target="_blank"
          rel="noreferrer"
        >
          Open repository
        </a>
        <a
          className="exercise-repo-callout__link"
          href={exerciseRepository.issuesUrl}
          target="_blank"
          rel="noreferrer"
        >
          Track setup issues
        </a>
      </div>
    </div>
  );
};

export default ExerciseRepoCallout;