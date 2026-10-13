import { useLocation } from '@docusaurus/router';
import { allSteps, type WorkshopStep } from '../data/workshopSteps';

export function useCurrentStep(): { current: WorkshopStep | null; next: WorkshopStep | null } {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, '') || '/';
  const index = allSteps.findIndex((step) => step.path === path);
  return {
    current: index >= 0 ? allSteps[index] : null,
    next: index >= 0 && index < allSteps.length - 1 ? allSteps[index + 1] : null,
  };
}
