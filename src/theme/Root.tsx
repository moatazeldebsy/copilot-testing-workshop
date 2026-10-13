import React from 'react';
import { ProgressProvider } from '@site/src/context/ProgressContext';

// Progress and quiz state is shared across the sidebar, pages and the home page.
export default function Root({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
