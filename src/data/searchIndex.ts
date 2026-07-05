export interface SearchEntry {
  title: string;
  path: string;
  keywords: string;
  description: string;
}

export const searchIndex: SearchEntry[] = [
  {
    title: 'Home',
    path: '/',
    keywords: 'home welcome overview genai github copilot testing workshop wearedevelopers berlin',
    description: 'GenAI in Testing workshop landing page — WeAreDevelopers Berlin 2026',
  },
  {
    title: 'Prerequisites',
    path: '/prerequisites',
    keywords: 'prerequisites setup vscode visual studio code copilot extension github account git install activate',
    description: 'Required software, tools, and Copilot access before starting',
  },
  {
    title: 'Environment Setup',
    path: '/workshop/setup',
    keywords: 'setup install vscode copilot extension activate starter repo clone first suggestion inline',
    description: 'Verify Copilot is active in VS Code and clone the starter repository',
  },
  {
    title: 'Introduction to GitHub Copilot',
    path: '/workshop/copilot-intro',
    keywords: 'github copilot introduction what is copilot llm large language model tokens context window inline completions chat modes slash commands tests explain fix fixTestFailure interaction surfaces model selection prompts',
    description: 'What GitHub Copilot is, interaction surfaces, chat modes, model selection, slash commands, tokens, and prompting technique',
  },
  {
    title: 'Copilot for Testing: The Big Picture',
    path: '/workshop/copilot-overview',
    keywords: 'copilot overview genai value risks trust human judgment mental model where effective limitations',
    description: 'Where GitHub Copilot adds value in testing workflows — and where it does not',
  },
  {
    title: 'Unit Test Generation',
    path: '/workshop/unit-testing',
    keywords: 'unit test generation copilot prompt patterns jest typescript generate review fix flaky false confidence',
    description: 'Use Copilot to generate, review, and refine unit tests responsibly',
  },
  {
    title: 'API & Integration Tests',
    path: '/workshop/api-integration',
    keywords: 'api rest integration test generation copilot supertest axios assertions review http endpoint',
    description: 'Generate REST API and integration tests with Copilot and review the output',
  },
  {
    title: 'Test Data & Mock Generation',
    path: '/workshop/test-data-mocks',
    keywords: 'test data mock fixture factory faker seed copilot generate stub secret hardcoded',
    description: 'Generate fixtures, mock factories, and test data with Copilot safely',
  },
  {
    title: 'Configuring Copilot for Your Team',
    path: '/workshop/copilot-configuration',
    keywords: 'configuring copilot team instructions copilot-instructions.md agents.md prompt files chat modes chatmode skills mcp model context protocol customization files agent personas',
    description: 'Custom instructions, prompt files, chat modes, GitHub skills, agent personas, and MCP servers for team-wide consistency',
  },
  {
    title: 'Reviewing AI Tests & Guardrails',
    path: '/workshop/reviewing-tests',
    keywords: 'review guardrails validate ai generated test checklist false confidence security red flags prompt template',
    description: 'Review AI-generated tests for correctness, security, and quality guardrails',
  },
  {
    title: 'CI/CD & Team Adoption',
    path: '/workshop/cicd-adoption',
    keywords: 'cicd github actions quality gate security scanning team adoption codeowners pr review workflow copilot',
    description: 'Integrate AI-assisted testing into CI/CD pipelines and adopt it team-wide',
  },
  {
    title: 'Key Takeaways',
    path: '/workshop/takeaways',
    keywords: 'takeaways summary learnings next steps resources copilot testing responsible ai',
    description: 'Workshop summary, key learnings, and next steps',
  },
];
