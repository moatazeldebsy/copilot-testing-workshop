import { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

const MODE_KEY = 'workshop-facilitator-mode';

// `?facilitator=true` (optionally `&duration=90`) turns facilitator mode on for this
// browser tab; it sticks across page navigation until `?facilitator=false`.
export function useFacilitatorMode(): { enabled: boolean; durationMinutes: number } {
  const { search } = useLocation();
  const [state, setState] = useState({ enabled: false, durationMinutes: 120 });

  useEffect(() => {
    const params = new URLSearchParams(search);
    let saved: { enabled: boolean; durationMinutes: number } | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(MODE_KEY) ?? 'null');
    } catch { /* ignore */ }

    const flag = params.get('facilitator');
    const next = flag === null
      ? saved ?? { enabled: false, durationMinutes: 120 }
      : { enabled: flag === 'true', durationMinutes: Number(params.get('duration')) || 120 };

    try {
      sessionStorage.setItem(MODE_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
    setState(next);
  }, [search]);

  return state;
}
