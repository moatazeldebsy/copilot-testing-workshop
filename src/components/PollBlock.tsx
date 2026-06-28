import React, { useId, useMemo, useState } from 'react';
import { useProgressContext } from '../context/ProgressContext';
import './PollBlock.css';

export interface PollOption {
  emoji: string;
  label: string;
  rationale?: string;
  isCorrect?: boolean;
}

interface PollBlockProps {
  question: string;
  options: PollOption[];
  note?: string;
  mode?: 'poll' | 'quiz';
  revealLabel?: string;
  quizId?: string;
}

const PollBlock: React.FC<PollBlockProps> = ({
  question,
  options,
  note,
  mode = 'poll',
  revealLabel = 'Reveal answer rationale',
  quizId,
}) => {
  const { markQuizComplete, isQuizComplete } = useProgressContext();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const feedbackId = useId();

  const selectedOption = useMemo(
    () => options.find((option) => option.label === selectedLabel) ?? null,
    [options, selectedLabel]
  );

  const isQuiz = mode === 'quiz';
  const isTrackedQuiz = isQuiz && Boolean(quizId);
  const alreadyCompleted = isTrackedQuiz && quizId ? isQuizComplete(quizId) : false;

  return (
    <div className={`poll-block ${isQuiz ? 'poll-block--quiz' : ''}`}>
      <div className="poll-block__header">
        <span className="poll-block__icon">{isQuiz ? '🧠' : '🙋'}</span>
        <span className="poll-block__label">{isQuiz ? 'Knowledge Check' : 'Audience Poll'}</span>
      </div>
      <p className="poll-block__question">{question}</p>
      <div className="poll-block__options">
        {options.map((opt) => {
          if (!isQuiz) {
            return (
              <div key={opt.label} className="poll-block__option">
                <span className="poll-block__emoji">{opt.emoji}</span>
                <span className="poll-block__option-label">{opt.label}</span>
              </div>
            );
          }

          const isSelected = selectedLabel === opt.label;
          const showCorrect = revealed && opt.isCorrect;

          return (
            <button
              key={opt.label}
              type="button"
              className={`poll-block__option poll-block__option--button ${isSelected ? 'poll-block__option--selected' : ''} ${showCorrect ? 'poll-block__option--correct' : ''}`}
              onClick={() => {
                setSelectedLabel(opt.label);
                setRevealed(false);
              }}
              aria-pressed={isSelected}
              aria-describedby={revealed && selectedOption?.label === opt.label ? feedbackId : undefined}
            >
              <span className="poll-block__emoji">{opt.emoji}</span>
              <span className="poll-block__option-label">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {isQuiz && (
        <div className="poll-block__quiz-controls">
          <button
            type="button"
            className="poll-block__reveal-btn"
            disabled={!selectedOption}
            onClick={() => {
              setRevealed(true);
              if (quizId) {
                markQuizComplete(quizId);
              }
            }}
          >
            {revealLabel}
          </button>
          {alreadyCompleted && (
            <span className="poll-block__completed" role="status" aria-live="polite">✓ Completion saved</span>
          )}
        </div>
      )}

      {isQuiz && revealed && selectedOption && (
        <div
          id={feedbackId}
          className={`poll-block__feedback ${selectedOption.isCorrect ? 'poll-block__feedback--correct' : 'poll-block__feedback--review'}`}
          role="status"
          aria-live="polite"
        >
          <strong>
            {selectedOption.isCorrect ? 'Great choice.' : 'Good try.'}
          </strong>{' '}
          {selectedOption.rationale ?? 'Review the checklist and compare with the recommended approach.'}
        </div>
      )}

      {note && <p className="poll-block__note">{note}</p>}
    </div>
  );
};

export default PollBlock;
