import React, { useEffect, useState } from 'react';
import { useFacilitatorMode } from '../hooks/useFacilitator';
import './WorkshopChrome.css';

const FACILITATOR_TIMER_KEY = 'workshop-facilitator-start';

const FacilitatorBar: React.FC = () => {
  const { enabled, durationMinutes } = useFacilitatorMode();
  const [nowMs, setNowMs] = useState(Date.now());
  const [startMs, setStartMs] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let persisted = NaN;
    try {
      persisted = Number(localStorage.getItem(FACILITATOR_TIMER_KEY));
    } catch { /* ignore */ }
    const initial = Number.isFinite(persisted) && persisted > 0 ? persisted : Date.now();
    try {
      localStorage.setItem(FACILITATOR_TIMER_KEY, String(initial));
    } catch { /* ignore */ }
    setStartMs(initial);

    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const sessionSeconds = durationMinutes * 60;
  const elapsedSeconds = startMs ? Math.max(0, Math.floor((nowMs - startMs) / 1000)) : 0;
  const remainingSeconds = Math.max(0, sessionSeconds - elapsedSeconds);
  const timerLabel = `${Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:${(remainingSeconds % 60)
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="facilitator-bar" role="status" aria-live="polite">
      <div className="facilitator-bar__left">
        <span className="facilitator-bar__badge">Facilitator mode</span>
        <span className="facilitator-bar__meta">{durationMinutes} min session</span>
      </div>
      <div className="facilitator-bar__right">
        <span className={`facilitator-bar__timer ${remainingSeconds <= 600 ? 'facilitator-bar__timer--warning' : ''}`}>
          {timerLabel} left
        </span>
        <button
          type="button"
          className="button button--sm button--secondary"
          onClick={() => {
            const freshStart = Date.now();
            try {
              localStorage.setItem(FACILITATOR_TIMER_KEY, String(freshStart));
            } catch { /* ignore */ }
            setStartMs(freshStart);
            setNowMs(freshStart);
          }}>
          Reset timer
        </button>
      </div>
    </div>
  );
};

export default FacilitatorBar;
