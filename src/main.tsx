import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import './styles/globals.css';

const Home = lazy(() => import('./pages/Home'));
const Prerequisites = lazy(() => import('./pages/Prerequisites'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const TutorialDetail = lazy(() => import('./pages/TutorialDetail'));
const Setup = lazy(() => import('./pages/workshop/Setup'));
const CopilotIntro = lazy(() => import('./pages/workshop/CopilotIntro'));
const CopilotOverview = lazy(() => import('./pages/workshop/CopilotOverview'));
const UnitTesting = lazy(() => import('./pages/workshop/UnitTesting'));
const ApiIntegration = lazy(() => import('./pages/workshop/ApiIntegration'));
const TestDataMocks = lazy(() => import('./pages/workshop/TestDataMocks'));
const ReviewingTests = lazy(() => import('./pages/workshop/ReviewingTests'));
const CicdAdoption = lazy(() => import('./pages/workshop/CicdAdoption'));
const Takeaways = lazy(() => import('./pages/workshop/Takeaways'));
const E2EPlaywright = lazy(() => import('./pages/workshop/E2EPlaywright'));
const ComponentTesting = lazy(() => import('./pages/workshop/ComponentTesting'));
const AiTestingPatterns = lazy(() => import('./pages/workshop/AiTestingPatterns'));

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProgressProvider>
        <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prerequisites" element={<Prerequisites />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorials/:slug" element={<TutorialDetail />} />
            <Route path="/workshop/setup" element={<Setup />} />
            <Route path="/workshop/copilot-intro" element={<CopilotIntro />} />
            <Route path="/workshop/copilot-overview" element={<CopilotOverview />} />
            <Route path="/workshop/unit-testing" element={<UnitTesting />} />
            <Route path="/workshop/api-integration" element={<ApiIntegration />} />
            <Route path="/workshop/test-data-mocks" element={<TestDataMocks />} />
            <Route path="/workshop/reviewing-tests" element={<ReviewingTests />} />
            <Route path="/workshop/cicd-adoption" element={<CicdAdoption />} />
            <Route path="/workshop/takeaways" element={<Takeaways />} />
            <Route path="/workshop/e2e-playwright" element={<E2EPlaywright />} />
            <Route path="/workshop/component-testing" element={<ComponentTesting />} />
            <Route path="/workshop/ai-testing-patterns" element={<AiTestingPatterns />} />
          </Routes>
        </Suspense>
      </ProgressProvider>
    </BrowserRouter>
  </React.StrictMode>
);
