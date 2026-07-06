export interface WorkshopStep {
  label: string;
  path: string;
  step?: string;
  exercise?: StepExerciseResources;
}

export interface StepExerciseResources {
  stepLabel: string;
  participantGoal: string;
  runCommand: string;
  primaryFiles: string[];
  solutionCheckpoints: string[];
}

export interface ExerciseRepository {
  name: string;
  url: string;
  cloneUrl: string;
  issuesUrl: string;
  defaultBranch: string;
}

export const exerciseRepository: ExerciseRepository = {
  name: 'copilot-testing-workshop',
  url: 'https://github.com/moatazeldebsy/copilot-testing-workshop',
  cloneUrl: 'https://github.com/moatazeldebsy/copilot-testing-workshop.git',
  issuesUrl: 'https://github.com/moatazeldebsy/copilot-testing-workshop/issues',
  defaultBranch: 'master',
};

export interface WorkshopSection {
  title: string;
  items: WorkshopStep[];
}

export const workshopSections: WorkshopSection[] = [
  {
    title: 'GenAI in Testing',
    items: [
      { label: 'Home', path: '/' },
      { label: 'Prerequisites', path: '/prerequisites' },
    ],
  },
  {
    title: 'Intro & Setup',
    items: [
      {
        label: 'Intro, Setup & Tour',
        path: '/workshop/setup',
        step: '0',
        exercise: {
          stepLabel: 'Setup',
          participantGoal:
            'Clone the exercises repo, install dependencies, activate Copilot, and tour the checkout pipeline (User → Cart → Discount → Fraud → Payment → Notification).',
          runCommand: 'npm install && npm run dev',
          primaryFiles: [
            'workshop-exercises/src/app.ts',
            'workshop-exercises/src/services/calculateDiscount.ts',
            'workshop-exercises/README.md',
          ],
          solutionCheckpoints: [],
        },
      },
      { label: 'Introduction to GitHub Copilot', path: '/workshop/copilot-intro' },
      { label: 'Copilot for Testing: The Big Picture', path: '/workshop/copilot-overview' },
    ],
  },
  {
    title: 'Exercise A — Unit tests',
    items: [
      {
        label: 'Unit Test Generation',
        path: '/workshop/unit-testing',
        step: 'A',
        exercise: {
          stepLabel: 'Exercise A',
          participantGoal:
            'Generate Jest unit tests for calculateDiscount() using Copilot. Discover that weak prompts produce tests that pass against buggy code; strong prompts expose all 3 bugs.',
          runCommand: 'npm test -- tests/unit/calculateDiscount.test.ts',
          primaryFiles: [
            'workshop-exercises/src/services/calculateDiscount.ts',
            'workshop-exercises/tests/unit/calculateDiscount.test.ts',
            'workshop-exercises/.copilot/context/domain-rules.md',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
    ],
  },
  {
    title: 'Exercise B — Review AI tests',
    items: [
      {
        label: 'Reviewing AI Tests & Guardrails',
        path: '/workshop/reviewing-tests',
        step: 'B',
        exercise: {
          stepLabel: 'Exercise B',
          participantGoal:
            'Read calculateDiscount.weak.test.ts. Identify tests that pass despite bugs. Rewrite with specific value assertions, boundary checks, and no toBeTruthy/toBeDefined.',
          runCommand: 'npm test -- tests/unit/calculateDiscount.weak.test.ts',
          primaryFiles: [
            'workshop-exercises/tests/unit/calculateDiscount.weak.test.ts',
            'workshop-exercises/src/services/calculateDiscount.ts',
            'workshop-exercises/.github/copilot-instructions.md',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
    ],
  },
  {
    title: 'Exercise C — API tests',
    items: [
      {
        label: 'API & Integration Tests',
        path: '/workshop/api-integration',
        step: 'C',
        exercise: {
          stepLabel: 'Exercise C',
          participantGoal:
            'Write Supertest coverage for the full checkout pipeline. Use domain-rules.md as Copilot context to generate domain-aware assertions for every error code.',
          runCommand: 'npm run test:api',
          primaryFiles: [
            'workshop-exercises/tests/api/checkout.test.ts',
            'workshop-exercises/.copilot/context/domain-rules.md',
            'workshop-exercises/src/openapi.ts',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
    ],
  },
  {
    title: 'Exercise D — Component tests',
    items: [
      {
        label: 'Component Testing with RTL',
        path: '/workshop/component-testing',
        step: 'D',
        exercise: {
          stepLabel: 'Exercise D',
          participantGoal:
            'Use React Testing Library to validate StorePage interactions. Prefer getByRole/getByTestId, avoid implementation details.',
          runCommand: 'npm test -- tests/components/StorePage.test.tsx',
          primaryFiles: [
            'workshop-exercises/src/ui/pages/StorePage.tsx',
            'workshop-exercises/tests/components/StorePage.test.tsx',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
      {
        label: 'E2E Testing with Playwright',
        path: '/workshop/e2e-playwright',
        step: 'D',
        exercise: {
          stepLabel: 'Exercise D',
          participantGoal:
            'Fill in the test.fixme placeholders in checkout.spec.ts using Playwright. Cover login, add-to-cart, discount application, and the full checkout flow end-to-end.',
          runCommand: 'npx playwright test tests/e2e/checkout.spec.ts',
          primaryFiles: [
            'workshop-exercises/tests/e2e/checkout.spec.ts',
            'workshop-exercises/src/ui/pages/LoginPage.tsx',
            'workshop-exercises/src/ui/pages/StorePage.tsx',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
    ],
  },
  {
    title: 'Configuring Copilot for your team',
    items: [
      { label: 'Configuring Copilot for Your Team', path: '/workshop/copilot-configuration' },
    ],
  },
  {
    title: 'Exercise E — CI guardrails',
    items: [
      {
        label: 'CI/CD & Team Adoption',
        path: '/workshop/cicd-adoption',
        step: 'E',
        exercise: {
          stepLabel: 'Exercise E',
          participantGoal:
            'Add enforceable quality gates: coverage threshold, flaky test identification, and .github/copilot-instructions.md to steer future Copilot output.',
          runCommand: 'npm test -- --coverage --coverageReporters=json-summary',
          primaryFiles: [
            'workshop-exercises/.github/workflows/test.yml',
            'workshop-exercises/.github/copilot-instructions.md',
            'workshop-exercises/tests/unit/notificationService.test.ts',
            'workshop-exercises/jest.config.ts',
          ],
          solutionCheckpoints: ['solutions'],
        },
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Testing AI-Powered Features', path: '/workshop/ai-testing-patterns' },
      { label: 'Test Data & Mock Generation', path: '/workshop/test-data-mocks' },
    ],
  },
  {
    title: 'Wrap-up & Q&A',
    items: [
      { label: 'Key Takeaways', path: '/workshop/takeaways' },
    ],
  },
];

export const allSteps: WorkshopStep[] = workshopSections.flatMap((s) => s.items).filter((item) => item.path !== '/');

export function getWorkshopStep(path: string): WorkshopStep | undefined {
  return allSteps.find((item) => item.path === path);
}
