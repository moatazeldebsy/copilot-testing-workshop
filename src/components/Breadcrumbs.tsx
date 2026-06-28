import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { workshopSections } from '../data/workshopSteps';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();

  // Find the current item and its section
  let currentLabel = '';
  let sectionTitle = '';

  for (const section of workshopSections) {
    const found = section.items.find((item) => item.path === pathname);
    if (found) {
      currentLabel = found.label;
      sectionTitle = section.title;
      break;
    }
  }

  if (!currentLabel || pathname === '/') return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-link">Home</Link>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-section">{sectionTitle}</span>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-current">{currentLabel}</span>
    </nav>
  );
};

export default Breadcrumbs;
