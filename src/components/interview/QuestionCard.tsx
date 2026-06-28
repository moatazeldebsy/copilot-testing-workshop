import React, { useState } from 'react';
import { InterviewQuestion, levelColors, categoryLabels } from '../../data/interviewData';
import './QuestionCard.css';

interface QuestionCardProps {
  question: InterviewQuestion;
  onClick?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      className="question-card"
      style={{ borderLeftColor: levelColors[question.level] }}
      onClick={() => {
        setIsExpanded(!isExpanded);
        onClick?.();
      }}
    >
      <div className="question-card__header">
        <h3 className="question-card__question">{question.question}</h3>
        <div className="question-card__meta">
          <span
            className="question-card__badge question-card__badge--level"
            style={{ backgroundColor: levelColors[question.level] }}
          >
            {question.level.charAt(0).toUpperCase() + question.level.slice(1)}
          </span>
          <span
            className="question-card__badge question-card__badge--difficulty"
            style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="question-card__badge question-card__badge--category">
            {categoryLabels[question.category]}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="question-card__content">
          <div className="question-card__section">
            <h4>Expected Answer</h4>
            <p className="question-card__answer">{question.expectedAnswer}</p>
          </div>

          {question.hints.length > 0 && (
            <div className="question-card__section">
              <h4>💡 Hints</h4>
              <ul className="question-card__list">
                {question.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {question.tips.length > 0 && (
            <div className="question-card__section">
              <h4>✨ Tips</h4>
              <ul className="question-card__list">
                {question.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {question.tags.length > 0 && (
            <div className="question-card__section">
              <h4>Tags</h4>
              <div className="question-card__tags">
                {question.tags.map((tag, idx) => (
                  <span key={idx} className="question-card__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="question-card__footer">
        <span className="question-card__toggle">
          {isExpanded ? '▼ Hide Answer' : '▶ Show Answer'}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
