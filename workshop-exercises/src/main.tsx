import React from 'react';
import { createRoot } from 'react-dom/client';
import WorkshopApp from './WorkshopApp';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <WorkshopApp />
  </React.StrictMode>
);