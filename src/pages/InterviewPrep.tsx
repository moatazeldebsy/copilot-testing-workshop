import React, { useState, useMemo } from 'react';
import { QALevel, InterviewCategory, interviewQuestions, getQuestionsByLevelAndCategory } from '../data/interviewData';
import LevelSelector from '../components/interview/LevelSelector';
import CategoryFilter from '../components/interview/CategoryFilter';
import QuestionCard from '../components/interview/QuestionCard';
import './InterviewPrep.css';

const InterviewPrep: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<QALevel>('mid');
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | null>(null);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory) {
      return getQuestionsByLevelAndCategory(selectedLevel, selectedCategory);
    }
    return interviewQuestions.filter(q => q.level === selectedLevel);
  }, [selectedLevel, selectedCategory]);

  const totalQuestions = interviewQuestions.filter(q => q.level === selectedLevel).length;
  const categoryCount = selectedCategory ? filteredQuestions.length : totalQuestions;

  return (
    <div className="interview-prep">
      {/* Hero Section */}
      <section className="interview-hero">
        <div className="interview-hero__content">
          <h1 className="interview-hero__title">QA Engineer Interview Prep</h1>
          <p className="interview-hero__subtitle">
            Master interview questions for Mid-Level, Senior, and Lead QA Engineer positions
          </p>
          <p className="interview-hero__description">
            Practice comprehensive interview questions covering test automation, QA strategy, API testing, 
            performance testing, leadership, and scenario-based challenges. Get insights, hints, and tips 
            to excel in your QA interview.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="interview-content">
        <div className="interview-content__inner">
          {/* Level Selector */}
          <LevelSelector
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />

          {/* Category Filter */}
          <CategoryFilter
            level={selectedLevel}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Questions Counter */}
          <div className="interview-counter">
            <p>
              Showing <strong>{filteredQuestions.length}</strong> question{filteredQuestions.length !== 1 ? 's' : ''} 
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Questions List */}
          <div className="interview-questions">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <div className="interview-empty">
                <p>No questions found for this selection.</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <section className="interview-stats">
            <h2 className="interview-stats__title">Interview Prep Stats</h2>
            <div className="interview-stats__grid">
              <div className="interview-stats__card">
                <div className="interview-stats__number">{totalQuestions}</div>
                <div className="interview-stats__label">Total Questions</div>
                <div className="interview-stats__description">For {selectedLevel} level</div>
              </div>
              <div className="interview-stats__card">
                <div className="interview-stats__number">7</div>
                <div className="interview-stats__label">Categories</div>
                <div className="interview-stats__description">Comprehensive coverage</div>
              </div>
              <div className="interview-stats__card">
                <div className="interview-stats__number">3</div>
                <div className="interview-stats__label">Career Levels</div>
                <div className="interview-stats__description">Mid, Senior, Lead</div>
              </div>
              <div className="interview-stats__card">
                <div className="interview-stats__number">∞</div>
                <div className="interview-stats__label">Practice</div>
                <div className="interview-stats__description">Review anytime</div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="interview-tips">
            <h2 className="interview-tips__title">Interview Tips</h2>
            <div className="interview-tips__grid">
              <div className="interview-tips__card">
                <h3>📝 Preparation</h3>
                <ul>
                  <li>Review questions thoroughly</li>
                  <li>Practice articulating your answers</li>
                  <li>Use real-world examples</li>
                  <li>Prepare follow-up questions</li>
                </ul>
              </div>
              <div className="interview-tips__card">
                <h3>💬 During Interview</h3>
                <ul>
                  <li>Listen carefully to questions</li>
                  <li>Ask for clarification if needed</li>
                  <li>Structure your answers clearly</li>
                  <li>Show your thinking process</li>
                </ul>
              </div>
              <div className="interview-tips__card">
                <h3>🎯 Best Practices</h3>
                <ul>
                  <li>Be honest about your experience</li>
                  <li>Focus on impact and results</li>
                  <li>Mention relevant tools and frameworks</li>
                  <li>Discuss lessons learned</li>
                </ul>
              </div>
              <div className="interview-tips__card">
                <h3>🚀 Stand Out</h3>
                <ul>
                  <li>Share specific metrics/outcomes</li>
                  <li>Discuss latest QA trends</li>
                  <li>Demonstrate continuous learning</li>
                  <li>Ask thoughtful questions</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default InterviewPrep;
