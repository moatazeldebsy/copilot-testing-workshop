import React from 'react';
import { QALevel, levelColors } from '../../data/interviewData';
import './LevelSelector.css';

interface LevelSelectorProps {
  selectedLevel: QALevel;
  onLevelChange: (level: QALevel) => void;
}

const levels: { id: QALevel; label: string; description: string }[] = [
  {
    id: 'mid',
    label: 'Mid-Level',
    description: '3-5 years of QA experience'
  },
  {
    id: 'senior',
    label: 'Senior',
    description: '5-8+ years of QA experience'
  },
  {
    id: 'lead',
    label: 'Lead / Manager',
    description: 'Leadership and strategy focus'
  }
];

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onLevelChange }) => {
  return (
    <div className="level-selector">
      <h2 className="level-selector__title">Select Your Level</h2>
      <div className="level-selector__grid">
        {levels.map((level) => (
          <button
            key={level.id}
            className={`level-selector__button ${selectedLevel === level.id ? 'level-selector__button--active' : ''}`}
            style={{
              borderTopColor: levelColors[level.id],
              backgroundColor:
                selectedLevel === level.id
                  ? `${levelColors[level.id]}15`
                  : 'transparent'
            }}
            onClick={() => onLevelChange(level.id)}
          >
            <div className="level-selector__badge" style={{ backgroundColor: levelColors[level.id] }}>
              {level.label.charAt(0)}
            </div>
            <h3 className="level-selector__name">{level.label}</h3>
            <p className="level-selector__description">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
