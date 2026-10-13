import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { allSteps, type WorkshopStep } from '../data/workshopSteps';

export function useCurrentStep(): { current: WorkshopStep | null; next: WorkshopStep | null } {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  // Step paths are base-relative ("/workshop/setup"); the location includes the base URL.
  const relative = pathname.startsWith(siteConfig.baseUrl)
    ? `/${pathname.slice(siteConfig.baseUrl.length)}`
    : pathname;
  const path = relative.replace(/\/+$/, '') || '/';
  const index = allSteps.findIndex((step) => step.path === path);
  return {
    current: index >= 0 ? allSteps[index] : null,
    next: index >= 0 && index < allSteps.length - 1 ? allSteps[index + 1] : null,
  };
}
