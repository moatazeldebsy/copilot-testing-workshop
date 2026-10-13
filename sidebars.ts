import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { workshopSections } from './src/data/workshopSteps';

// The sidebar is generated from workshopSections so ordering, section titles and
// step badges stay in one place (the progress tracker reads the same data).
const docIdFromPath = (path: string) => path.replace(/^\//, '');

const sidebars: SidebarsConfig = {
  workshop: [
    { type: 'link', label: 'Overview', href: '/' },
    // Not a workshop step, so it stays out of workshopSections and progress tracking.
    {
      type: 'category',
      label: 'Since the workshop',
      collapsible: false,
      items: [{ type: 'doc', id: 'workshop/whats-new' }],
    },
    ...workshopSections.map((section) => ({
      type: 'category' as const,
      label: section.title,
      collapsible: true,
      collapsed: false,
      items: section.items
        .filter((item) => item.path !== '/')
        .map((item) =>
          item.path === '/tutorials'
            ? { type: 'link' as const, label: item.label, href: '/tutorials' }
            : {
                type: 'doc' as const,
                id: docIdFromPath(item.path),
                label: item.label,
                customProps: { step: item.step, path: item.path },
              },
        ),
    })),
  ],
};

export default sidebars;
