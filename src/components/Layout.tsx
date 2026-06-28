import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import StepNavigation from './StepNavigation';
import './Layout.css';

const FACILITATOR_TIMER_KEY = 'workshop-facilitator-start';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isFacilitatorMode = searchParams.get('facilitator') === 'true';
  const durationMinutes = Number(searchParams.get('duration')) || 120;
  const [nowMs, setNowMs] = useState(Date.now());
  const [startMs, setStartMs] = useState<number | null>(null);

  useEffect(() => {
    if (!isFacilitatorMode) {
      return;
    }

    const persisted = Number(localStorage.getItem(FACILITATOR_TIMER_KEY));
    const initial = Number.isFinite(persisted) && persisted > 0 ? persisted : Date.now();
    localStorage.setItem(FACILITATOR_TIMER_KEY, String(initial));
    setStartMs(initial);

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isFacilitatorMode]);

  const sessionSeconds = durationMinutes * 60;
  const elapsedSeconds = startMs ? Math.max(0, Math.floor((nowMs - startMs) / 1000)) : 0;
  const remainingSeconds = Math.max(0, sessionSeconds - elapsedSeconds);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingRemainder = remainingSeconds % 60;
  const timerLabel = `${remainingMinutes.toString().padStart(2, '0')}:${remainingRemainder
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        {isFacilitatorMode && (
          <div className="facilitator-bar" role="status" aria-live="polite">
            <div className="facilitator-bar__left">
              <span className="facilitator-bar__badge">Facilitator Mode</span>
              <span className="facilitator-bar__meta">Session duration: {durationMinutes} min</span>
            </div>
            <div className="facilitator-bar__right">
              <span className={`facilitator-bar__timer ${remainingSeconds <= 600 ? 'facilitator-bar__timer--warning' : ''}`}>
                Time left: {timerLabel}
              </span>
              <button
                type="button"
                className="facilitator-bar__reset"
                onClick={() => {
                  const freshStart = Date.now();
                  localStorage.setItem(FACILITATOR_TIMER_KEY, String(freshStart));
                  setStartMs(freshStart);
                  setNowMs(freshStart);
                }}
              >
                Reset Timer
              </button>
            </div>
          </div>
        )}
        <Breadcrumbs />
        {children}
        <StepNavigation />
      </main>
    </div>
  );
};

export default Layout;
