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
  name: 'copilot-testing-workshop-exercises',
  url: 'https://github.com/YOUR_ORG/copilot-testing-workshop-exercises',
  cloneUrl: 'https://github.com/YOUR_ORG/copilot-testing-workshop-exercises.git',
  issuesUrl: 'https://github.com/YOUR_ORG/copilot-testing-workshop-exercises/issues',
  defaultBranch: 'main',
};

export interface WorkshopSection {
  title: string;
  items: WorkshopStep[];
}

export const workshopSections: WorkshopSection[] = [
  {
    title: 'GenAI Testing Workshop',
    items: [
      { label: 'Home', path: '/' },
      { label: 'Prerequisites', path: '/prerequisites' },
    ],
  },
  {
    title: 'Part 1 — Foundations',
    items: [
      {
        label: 'Environment Setup',
        path: '/workshop/setup',
        step: '1',
        exercise: {
          stepLabel: 'Step 1 setup',
          participantGoal: 'Clone the shared exercises repo, install dependencies, and stay on main for the live workshop.',
          runCommand: 'npm install',
          primaryFiles: [
            'src/services/userService.ts',
            'src/app.ts',
            'tests/',
          ],
          solutionCheckpoints: [
            'solution/step-4-unit',
            'solution/step-5-api',
            'solution/step-9-e2e',
            'solution/step-10-component',
            'solution/step-11-ai',
          ],
        },
      },
      { label: 'Introduction to GitHub Copilot', path: '/workshop/copilot-intro', step: '2' },
      { label: 'Copilot for Testing: The Big Picture', path: '/workshop/copilot-overview', step: '3' },
    ],
  },
  {
    title: 'Part 2 — Generating Tests',
    items: [
      {
        label: 'Unit Test Generation',
        path: '/workshop/unit-testing',
        step: '4',
        exercise: {
          stepLabel: 'Step 4 unit tests',
          participantGoal: 'Generate and review Jest unit tests for UserService without leaving the starter branch.',
          runCommand: 'npm test -- tests/unit/userService.test.ts',
          primaryFiles: [
            'src/services/userService.ts',
            'src/repositories/userRepository.ts',
            'tests/unit/userService.test.ts',
          ],
          solutionCheckpoints: ['solution/step-4-unit'],
        },
      },
      {
        label: 'API & Integration Tests',
        path: '/workshop/api-integration',
        step: '5',
        exercise: {
          stepLabel: 'Step 5 API tests',
          participantGoal: 'Add Supertest coverage for register/login and protected user routes, then validate auth and structured error contracts.',
          runCommand: 'npm run test:api',
          primaryFiles: [
            'src/app.ts',
            'src/services/userService.ts',
            'src/services/tokenService.ts',
            'tests/api/auth-and-users.test.ts',
          ],
          solutionCheckpoints: ['solution/step-5-api'],
        },
      },
      {
        label: 'Test Data & Mock Generation',
        path: '/workshop/test-data-mocks',
        step: '6',
        exercise: {
          stepLabel: 'Step 6 test data',
          participantGoal: 'Create reusable factories and service mocks that feed the earlier unit and API exercises without leaking realistic secrets.',
          runCommand: 'npm test -- tests/unit/userService.test.ts',
          primaryFiles: [
            'src/models/user.ts',
            'tests/factories/userFactory.ts',
            'tests/mocks/mockEmailService.ts',
          ],
          solutionCheckpoints: ['solution/step-6-mocks'],
        },
      },
    ],
  },
  {
    title: 'Part 3 — Responsible Use',
    items: [
      {
        label: 'Reviewing AI Tests & Guardrails',
        path: '/workshop/reviewing-tests',
        step: '7',
        exercise: {
          stepLabel: 'Step 7 review pass',
          participantGoal: 'Review the generated test files, tighten weak assertions, and remove flaky or tautological patterns before merge.',
          runCommand: 'npm test -- --coverage',
          primaryFiles: [
            'tests/unit/userService.test.ts',
            'tests/api/users.api.test.ts',
            '.github/pull_request_template.md',
          ],
          solutionCheckpoints: ['solution/step-7-review'],
        },
      },
      {
        label: 'CI/CD & Team Adoption',
        path: '/workshop/cicd-adoption',
        step: '8',
        exercise: {
          stepLabel: 'Step 8 CI guardrails',
          participantGoal: 'Add enforceable quality gates so the workshop tests must pass lint, secret scanning, and coverage thresholds in CI.',
          runCommand: 'npm test -- --coverage --coverageReporters=json-summary',
          primaryFiles: [
            '.github/workflows/test.yml',
            'jest.config.ts',
            '.github/CODEOWNERS',
          ],
          solutionCheckpoints: ['solution/step-8-ci'],
        },
      },
    ],
  },
  {
    title: 'Part 4 — Advanced & AI Testing',
    items: [
      {
        label: 'E2E Testing with Playwright',
        path: '/workshop/e2e-playwright',
        step: '9',
        exercise: {
          stepLabel: 'Step 9 E2E tests',
          participantGoal: 'Build a Playwright page object and login flow tests against the workshop app UI.',
          runCommand: 'npx playwright test tests/e2e/login.spec.ts',
          primaryFiles: [
            'src/ui/pages/LoginPage.tsx',
            'tests/e2e/pages/LoginPage.ts',
            'tests/e2e/login.spec.ts',
          ],
          solutionCheckpoints: ['solution/step-9-e2e'],
        },
      },
      {
        label: 'Component Testing with RTL',
        path: '/workshop/component-testing',
        step: '10',
        exercise: {
          stepLabel: 'Step 10 component tests',
          participantGoal: 'Use React Testing Library to validate the registration form through accessible user interactions.',
          runCommand: 'npm test -- tests/components/RegistrationForm.test.tsx',
          primaryFiles: [
            'src/components/RegistrationForm.tsx',
            'tests/components/RegistrationForm.test.tsx',
            'tests/utils/renderWithProviders.tsx',
          ],
          solutionCheckpoints: ['solution/step-10-component'],
        },
      },
      {
        label: 'Testing AI-Powered Features',
        path: '/workshop/ai-testing-patterns',
        step: '11',
        exercise: {
          stepLabel: 'Step 11 AI features',
          participantGoal: 'Test AI-facing services with structural assertions, prompt-injection checks, and mocked tool or LLM dependencies.',
          runCommand: 'npm test -- tests/services/summarizationService.test.ts',
          primaryFiles: [
            'src/services/summarizationService.ts',
            'src/services/promptBuilder.ts',
            'tests/services/summarizationService.test.ts',
          ],
          solutionCheckpoints: ['solution/step-11-ai'],
        },
      },
    ],
  },
  {
    title: 'Wrap-up',
    items: [
      { label: 'Key Takeaways', path: '/workshop/takeaways' },
    ],
  },
];

export const allSteps: WorkshopStep[] = workshopSections.flatMap((s) => s.items).filter((item) => item.path !== '/');

export function getWorkshopStep(path: string): WorkshopStep | undefined {
  return allSteps.find((item) => item.path === path);
}
