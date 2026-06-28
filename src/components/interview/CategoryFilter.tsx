import React from 'react';
import { InterviewCategory, categoryLabels, QALevel, getCategoriesByLevel } from '../../data/interviewData';
import './CategoryFilter.css';

interface CategoryFilterProps {
  level: QALevel;
  selectedCategory: InterviewCategory | null;
  onCategoryChange: (category: InterviewCategory | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  level,
  selectedCategory,
  onCategoryChange
}) => {
  const categories = getCategoriesByLevel(level);

  return (
    <div className="category-filter">
      <h3 className="category-filter__title">Filter by Category</h3>
      <div className="category-filter__buttons">
        <button
          className={`category-filter__button ${selectedCategory === null ? 'category-filter__button--active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-filter__button ${selectedCategory === category ? 'category-filter__button--active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
