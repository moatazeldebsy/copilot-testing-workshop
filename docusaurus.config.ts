import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { exerciseRepository } from './src/data/workshopSteps';

// GitHub Pages serves the site from /<repo>/; local, Docker and Codespaces runs use /.
const siteUrl = process.env.DOCS_URL ?? 'https://moatazeldebsy.github.io';
const baseUrl = process.env.DOCS_BASE_URL ?? '/';
const slidesHref = `pathname://${baseUrl}GenAI-in-testing.pdf`;

const config: Config = {
  title: 'GenAI in Testing',
  tagline: 'Using GitHub Copilot to Accelerate Quality Without Losing Trust',
  favicon: 'img/favicon.svg',

  url: siteUrl,
  baseUrl,
  organizationName: 'moatazeldebsy',
  projectName: exerciseRepository.name,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  // Keep docs/slides/GenAI-in-testing.pdf where the README links to it, and serve it at /GenAI-in-testing.pdf.
  staticDirectories: ['static', 'docs/slides'],

  markdown: {
    // .md (e.g. the workshop-exercises tutorials) parse as CommonMark; .mdx as MDX.
    format: 'detect',
    hooks: { onBrokenMarkdownLinks: 'warn' },
  },

  i18n: { defaultLocale: 'en', locales: ['en'] },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Hubot+Sans:wght@400..900&family=Mona+Sans:wght@200..900&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${exerciseRepository.url}/edit/${exerciseRepository.defaultBranch}/`,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/workshop.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        // Single source of truth: the tutorials live alongside the exercises.
        path: 'workshop-exercises/docs/tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: './sidebarsTutorials.ts',
        editUrl: `${exerciseRepository.url}/edit/${exerciseRepository.defaultBranch}/workshop-exercises/docs/tutorials/`,
      },
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: ['/', '/tutorials'],
        docsPluginIdForPreferredVersion: 'default',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    announcementBar: {
      id: 'whats-new-2026-10',
      content: `<b>Updated October 2026:</b> <a href="${baseUrl}whats-new">see what's changed in GitHub Copilot since the workshop</a>.`,
      isCloseable: true,
    },
    docs: {
      sidebar: { hideable: true, autoCollapseCategories: false },
    },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    navbar: {
      title: 'Copilot Testing',
      logo: { alt: 'Copilot Testing workshop', src: 'img/logo.svg' },
      hideOnScroll: false,
      items: [
        { type: 'docSidebar', sidebarId: 'workshop', position: 'left', label: 'Workshop' },
        { to: '/workshop/unit-testing', label: 'Exercises', position: 'left' },
        { to: '/workshop/copilot-configuration', label: 'Configure Copilot', position: 'left' },
        { type: 'docSidebar', sidebarId: 'tutorials', docsPluginId: 'tutorials', position: 'left', label: 'Tutorials' },
        { to: '/whats-new', label: "What's new", position: 'left' },
        { href: slidesHref, label: 'Slides', position: 'right' },
        { type: 'search', position: 'right' },
        {
          href: exerciseRepository.url,
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workshop',
          items: [
            { label: 'Prerequisites', to: '/prerequisites' },
            { label: 'Setup', to: '/workshop/setup' },
            { label: 'Key Takeaways', to: '/workshop/takeaways' },
          ],
        },
        {
          title: 'Practice',
          items: [
            { label: 'Exercise repository', href: exerciseRepository.url },
            { label: 'Open in Codespaces', href: 'https://codespaces.new/moatazeldebsy/copilot-testing-workshop?quickstart=1' },
            { label: 'Report a setup issue', href: exerciseRepository.issuesUrl },
          ],
        },
        {
          title: 'Event',
          items: [
            {
              label: 'WeAreDevelopers World Congress',
              href: 'https://www.wearedevelopers.com/world-congress/agenda/workshops/genai-in-testing-using-github-copilot-to-accelerate-quality-without-losing-trust-1107886',
            },
            { label: 'Slides (PDF)', href: slidesHref },
          ],
        },
      ],
      copyright: `GenAI in Testing workshop · MIT licensed · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'yaml', 'python', 'java', 'docker', 'diff'],
      magicComments: [
        { className: 'theme-code-block-highlighted-line', line: 'highlight-next-line', block: { start: 'highlight-start', end: 'highlight-end' } },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
