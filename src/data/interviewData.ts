export type QALevel = 'mid' | 'senior' | 'lead';
export type InterviewCategory = 
  | 'test-automation'
  | 'qa-strategy'
  | 'api-testing'
  | 'performance'
  | 'leadership'
  | 'scenario-based'
  | 'behavioral';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: InterviewCategory;
  level: QALevel;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  hints: string[];
  tips: string[];
  tags: string[];
}

export const categoryLabels: Record<InterviewCategory, string> = {
  'test-automation': 'Test Automation',
  'qa-strategy': 'QA Strategy',
  'api-testing': 'API Testing',
  'performance': 'Performance Testing',
  'leadership': 'Leadership',
  'scenario-based': 'Scenario-Based',
  'behavioral': 'Behavioral'
};

export const levelColors: Record<QALevel, string> = {
  'mid': '#3b82f6',
  'senior': '#f59e0b',
  'lead': '#ef4444'
};

export const interviewQuestions: InterviewQuestion[] = [
  // MID-LEVEL: Test Automation
  {
    id: 'mid-ta-001',
    question: 'Explain the Page Object Model (POM) pattern and why it\'s important in test automation.',
    category: 'test-automation',
    level: 'mid',
    difficulty: 'medium',
    expectedAnswer: `The Page Object Model is a design pattern that encapsulates the details of a web page into a single class. Each page or component gets its own class that contains:
    - Locators/selectors for elements
    - Methods representing user interactions
    - Element retrieval logic
    
Benefits:
    - Maintainability: Changes to UI are localized to one place
    - Reusability: Methods can be reused across multiple tests
    - Readability: Tests become more expressive and easier to understand
    - Reduces duplication: Common interactions are centralized
    
Example structure:
    - LoginPage.ts with loginWithCredentials(), getErrorMessage()
    - HomePage.ts with navigateToSettings(), getWelcomeMessage()`,
    hints: [
      'Think about what happens when a web page UI changes',
      'Consider how to reduce code duplication across tests',
      'What makes test code more readable and maintainable?'
    ],
    tips: [
      'POM is especially valuable in projects with many tests',
      'Combine with fluent API patterns for chain-able methods',
      'Keep page classes focused on one page/component'
    ],
    tags: ['Selenium', 'Cypress', 'Playwright', 'Design Patterns']
  },
  {
    id: 'mid-ta-002',
    question: 'What are the differences between Selenium, Cypress, and Playwright? When would you use each?',
    category: 'test-automation',
    level: 'mid',
    difficulty: 'hard',
    expectedAnswer: `Selenium:
    - Oldest, most mature framework (since 2004)
    - Supports multiple languages (Java, Python, C#, etc.)
    - Cross-browser support (Chrome, Firefox, Safari, Edge)
    - Slower execution, requires waits
    - Large community and ecosystem
    
Cypress:
    - Modern, developer-friendly, JavaScript-focused
    - Excellent debugging capabilities (time travel, video recording)
    - Limited to Chrome-based browsers and Firefox
    - Fast execution, automatic waiting
    - Great for React/Vue applications
    - Limited cross-browser support
    
Playwright:
    - By Microsoft, built for speed
    - Supports Chromium, Firefox, WebKit
    - Better cross-browser support than Cypress
    - True parallel execution
    - Great for CI/CD pipelines
    
Use Selenium when:
    - You need multiple languages and broad browser support
    - Working with legacy systems
    
Use Cypress when:
    - Building modern SPA tests
    - Developer experience is priority
    - Debugging is important
    
Use Playwright when:
    - You need speed and parallel execution
    - Cross-browser testing is critical
    - Building for CI/CD pipelines`,
    hints: [
      'Consider the technology stack of the application',
      'Think about browser support requirements',
      'Execution speed and CI/CD integration matter'
    ],
    tips: [
      'Each tool has different sweet spots',
      'Consider team expertise and preferences',
      'Hybrid approaches (multiple tools) can work'
    ],
    tags: ['Selenium', 'Cypress', 'Playwright', 'Comparison']
  },
  {
    id: 'mid-ta-003',
    question: 'How would you handle flaky tests in your automation suite?',
    category: 'test-automation',
    level: 'mid',
    difficulty: 'hard',
    expectedAnswer: `Flaky tests are tests that pass and fail intermittently. Here's how to handle them:

Identify Flakiness:
    - Use CI/CD metrics to track failing tests
    - Monitor test execution reports
    - Categorize failures (network, timing, race conditions)

Root Causes:
    - Timing issues (elements not ready, animations)
    - Race conditions in async operations
    - External dependencies (APIs, databases)
    - Resource contention
    - Improper wait strategies

Solutions:
    1. Explicit Waits: Replace sleep(ms) with WebDriverWait for conditions
    2. Stabilize Environment: Control test data, isolate tests
    3. Retry Logic: Implement intelligent retries (not for all tests)
    4. Async Handling: Properly wait for async operations
    5. Reduce External Dependencies: Use mocks/stubs
    6. Monitor Resources: Check memory, CPU during tests
    
Best Practices:
    - Don't ignore failing tests
    - Investigate root cause first
    - Fix flakiness rather than increasing timeouts
    - Consider deterministic test design
    - Document known flaky areas`,
    hints: [
      'What causes tests to behave unpredictably?',
      'How can you make tests more deterministic?',
      'What\'s the difference between sleeping and waiting?'
    ],
    tips: [
      'Use explicit waits (WebDriverWait, cy.intercept)',
      'Avoid hard timeouts/sleep calls',
      'Isolate test data to reduce race conditions'
    ],
    tags: ['Flakiness', 'Reliability', 'Best Practices']
  },

  // MID-LEVEL: QA Strategy
  {
    id: 'mid-qs-001',
    question: 'What is the testing pyramid and how does it apply to your test automation strategy?',
    category: 'qa-strategy',
    level: 'mid',
    difficulty: 'medium',
    expectedAnswer: `The Testing Pyramid is a strategy for organizing tests by scope and speed:

Structure (bottom to top):
    Unit Tests (70%): Fast, isolated, no dependencies
    Integration Tests (20%): Test multiple components together
    E2E Tests (10%): Full system tests, slowest, most valuable

Rationale:
    - Unit tests run fast (milliseconds)
    - Integration tests slower (seconds)
    - E2E tests slowest (minutes)
    - More tests at bottom = faster feedback
    
Benefits:
    - Fast feedback cycle
    - Cost effective (cheap to run many unit tests)
    - Balanced coverage
    - Reduced maintenance burden
    
Application:
    - Focus on unit testing business logic
    - Integration tests for critical workflows
    - E2E tests for key user paths
    - Run unit tests on every commit
    - Run integration tests frequently
    - Run E2E tests in CI/CD pipeline

Avoid:
    - Focusing only on E2E tests (slow, flaky, expensive)
    - Over-testing at every level
    - Testing UI through unit tests`,
    hints: [
      'Why do different test types have different costs?',
      'How fast should tests run?',
      'What should be tested at each level?'
    ],
    tips: [
      'A good ratio is 70/20/10 (unit/integration/E2E)',
      'This applies to API and UI testing',
      'Adjust based on your specific needs'
    ],
    tags: ['Testing Strategy', 'Test Levels', 'Architecture']
  },
  {
    id: 'mid-qs-002',
    question: 'How do you approach testing a new feature from a QA perspective?',
    category: 'qa-strategy',
    level: 'mid',
    difficulty: 'medium',
    expectedAnswer: `Testing a new feature involves multiple phases:

1. Requirements Analysis:
    - Understand acceptance criteria
    - Identify happy paths and edge cases
    - Document assumptions
    - Ask clarifying questions

2. Test Planning:
    - Define scope (what to test, what not to)
    - Determine test types needed (unit, integration, E2E)
    - Estimate effort and timeline
    - Identify risks and blockers

3. Test Case Development:
    - Create test cases for happy paths
    - Add edge cases and error scenarios
    - Document prerequisites and data
    - Include negative test cases
    - Test boundary conditions

4. Test Execution:
    - Execute on multiple browsers/devices
    - Test with different user roles
    - Verify across environments
    - Check performance
    - Test accessibility

5. Bug Reporting:
    - Clear reproduction steps
    - Screenshots/videos
    - Expected vs actual
    - Environment details
    - Severity assessment

6. Regression Testing:
    - Ensure existing features still work
    - Check integration with related features
    - Run automated regression suite`,
    hints: [
      'What questions should you ask before testing?',
      'What scenarios might users encounter?',
      'How do you ensure quality holistically?'
    ],
    tips: [
      'Collaboration with developers early is key',
      'Use risk-based testing to prioritize',
      'Automate repetitive scenarios'
    ],
    tags: ['Feature Testing', 'Test Planning', 'QA Process']
  },

  // MID-LEVEL: API Testing
  {
    id: 'mid-api-001',
    question: 'How would you test a REST API endpoint? What aspects would you cover?',
    category: 'api-testing',
    level: 'mid',
    difficulty: 'medium',
    expectedAnswer: `Testing a REST API involves multiple dimensions:

1. Happy Path Tests:
    - Correct request format
    - Valid parameters
    - Expected response code (200, 201)
    - Response structure and data types
    - Response content accuracy

2. Status Code Tests:
    - 400 Bad Request (invalid data)
    - 401 Unauthorized (missing auth)
    - 403 Forbidden (insufficient permissions)
    - 404 Not Found (resource doesn't exist)
    - 500 Server Error
    - 429 Rate Limiting

3. Data Validation:
    - Response schema validation
    - Required fields present
    - Correct data types
    - Data consistency with request

4. Authentication & Authorization:
    - Missing token handling
    - Expired token handling
    - Invalid token handling
    - Role-based access control

5. Edge Cases:
    - Empty/null values
    - Boundary values (max/min)
    - Special characters
    - Very large payloads
    - Missing optional fields

6. Performance:
    - Response time
    - Payload size
    - Concurrent requests

7. Security:
    - SQL injection attempts
    - XSS payloads
    - CORS headers
    - Sensitive data in logs

Tools: Postman, REST Assured, Cypress, Playwright`,
    hints: [
      'Think beyond just 200 OK responses',
      'What can go wrong with data?',
      'What security concerns exist for APIs?'
    ],
    tips: [
      'Use contract testing for API stability',
      'Automate API tests in CI/CD',
      'Keep test data separate from production'
    ],
    tags: ['API Testing', 'REST', 'Postman']
  },

  // SENIOR-LEVEL: Test Automation
  {
    id: 'sr-ta-001',
    question: 'Design a scalable test automation architecture for a large enterprise application.',
    category: 'test-automation',
    level: 'senior',
    difficulty: 'hard',
    expectedAnswer: `A scalable architecture requires multiple layers and considerations:

Test Framework Architecture:
    - Separate test code from test data
    - Use dependency injection for configurations
    - Implement factory patterns for page objects
    - Create utility libraries for common operations
    - Version control framework separately

Organize Test Code:
    - By feature (domain-driven structure)
    - By test type (unit, API, UI)
    - Separate concerns: UI, business logic, data
    - Reusable test components and utilities

Test Data Management:
    - Data builders and factories
    - Test data seeding mechanisms
    - Environment-specific configurations
    - Cleanup and teardown strategies
    - Version control test data

CI/CD Integration:
    - Parallel test execution
    - Test result reporting
    - Artifact collection (logs, screenshots, videos)
    - Failure analysis and reporting
    - Performance metrics tracking

Scalability Patterns:
    - Grid-based execution (Selenium Grid, BrowserStack)
    - Cloud-based browsers
    - Docker containerization
    - Infrastructure as Code
    - Microservices testing approach

Maintenance:
    - Regular refactoring
    - Test maintenance dashboard
    - Flakiness monitoring
    - Code review process
    - Documentation standards

Monitoring & Analytics:
    - Test execution metrics
    - Failure trend analysis
    - Coverage reports
    - Performance benchmarks
    - Team productivity metrics`,
    hints: [
      'How do you handle thousands of tests?',
      'What breaks in large test suites?',
      'How do you maintain and scale this?'
    ],
    tips: [
      'Start simple, scale gradually',
      'Monitor test health continuously',
      'Automate the automation framework'
    ],
    tags: ['Architecture', 'Enterprise', 'Scalability']
  },
  {
    id: 'sr-ta-002',
    question: 'How do you approach test maintenance in a large suite with thousands of tests?',
    category: 'test-automation',
    level: 'senior',
    difficulty: 'hard',
    expectedAnswer: `Test maintenance is critical for long-term success:

Preventive Measures:
    - Establish coding standards and style guides
    - Implement peer review process
    - Use linting and static analysis
    - Automated code quality checks
    - Documentation standards

Monitoring & Detection:
    - Track test execution trends
    - Monitor flakiness rates
    - Identify slow tests
    - Track maintenance burden (failures per test)
    - Analytics dashboards

Categorization:
    - Classify tests by risk/value
    - Identify redundant tests
    - Remove low-value tests
    - Prioritize high-impact areas
    - Track coverage metrics

Refactoring Strategy:
    - Identify patterns and duplications
    - Create shared utilities
    - Consolidate similar tests
    - Update deprecated methods
    - Improve readability

Test Evolution:
    - Remove obsolete tests
    - Consolidate overlapping tests
    - Move tests to appropriate levels
    - Update for feature changes
    - Optimize slow tests

Collaboration:
    - Test ownership model
    - Cross-team knowledge sharing
    - Training and mentoring
    - Regular retrospectives
    - Tool and framework updates

Tooling:
    - Test analytics platforms
    - CI/CD dashboards
    - Automated reporting
    - Test data management tools
    - Monitoring solutions`,
    hints: [
      'What happens when nobody maintains tests?',
      'How do you identify maintenance burden?',
      'What metrics matter for test health?'
    ],
    tips: [
      'Treat tests as first-class code',
      'Measure and monitor actively',
      'Have a retirement policy for old tests'
    ],
    tags: ['Maintenance', 'Technical Debt', 'Metrics']
  },

  // SENIOR-LEVEL: QA Strategy
  {
    id: 'sr-qs-001',
    question: 'How would you establish a quality metrics framework for your QA team?',
    category: 'qa-strategy',
    level: 'senior',
    difficulty: 'hard',
    expectedAnswer: `A quality metrics framework provides visibility and drives decisions:

Key Metrics to Track:

    Coverage Metrics:
        - Code coverage percentage
        - Feature coverage
        - Test case coverage by requirement
        - Browser/device coverage
        - API endpoint coverage

    Test Execution Metrics:
        - Pass rate percentage
        - Flakiness rate
        - Average execution time
        - Test efficiency (tests per hour)
        - Automation ROI (maintenance time vs savings)

    Defect Metrics:
        - Bugs found per test type
        - Bug escape rate (bugs in production)
        - Bug severity distribution
        - Time to fix
        - Recurrence rate

    Quality Metrics:
        - Issue density (defects per 1000 lines)
        - Critical path coverage
        - Risk-based test distribution
        - Test environment availability
        - Data quality issues

    Efficiency Metrics:
        - Test case creation rate
        - Test maintenance time
        - Automation adoption rate
        - Tool utilization
        - Cycle time

Dashboard & Reporting:
        - Real-time dashboards
        - Trend analysis
        - Historical comparisons
        - Team performance views
        - Executive summaries

Using Metrics:
        - Set baseline and targets
        - Identify improvement areas
        - Drive tool/process decisions
        - Celebrate wins
        - Adjust strategies based on data

Pitfalls to Avoid:
        - Vanity metrics (chasing numbers)
        - Over-measuring (analysis paralysis)
        - Ignoring context
        - Using metrics to blame
        - Not acting on insights`,
    hints: [
      'What matters most to stakeholders?',
      'How do you measure quality without just counting?',
      'What drives better decision-making?'
    ],
    tips: [
      'Start with 5-7 key metrics, expand gradually',
      'Link metrics to business outcomes',
      'Use data to improve, not punish'
    ],
    tags: ['Metrics', 'Management', 'Quality Assurance']
  },
  {
    id: 'sr-qs-002',
    question: 'How do you balance speed of delivery with quality assurance?',
    category: 'qa-strategy',
    level: 'senior',
    difficulty: 'hard',
    expectedAnswer: `Finding the right balance requires strategic thinking:

Assessment Phase:
    - Understand business priorities
    - Identify critical paths vs nice-to-haves
    - Assess risk tolerance
    - Evaluate timeline constraints
    - Determine quality gates

Risk-Based Testing:
    - Focus on high-risk areas
    - Reduce testing on low-risk areas
    - Impact analysis for changes
    - Prioritize test cases by risk
    - Use risk matrices

Testing Strategy:
    - Pyramid approach (70/20/10)
    - Continuous testing throughout development
    - Shift-left practices (early testing)
    - Automation for regression
    - Manual testing for exploration

Collaboration:
    - Partner with development early
    - Participate in planning
    - Set quality expectations upfront
    - Clear definition of done
    - Shared responsibility for quality

Process Optimization:
    - Parallel testing activities
    - Test automation investment
    - Efficient test case design
    - Reusable test assets
    - CI/CD pipeline optimization

Technical Practices:
    - Test-driven development (TDD)
    - Continuous integration
    - Code reviews
    - Static analysis
    - Automated testing

Monitoring & Adaptation:
    - Track quality trends
    - Monitor production issues
    - Adjust testing scope based on data
    - Post-mortem on escapes
    - Continuous improvement

Stakeholder Management:
    - Clear quality metrics
    - Regular communication
    - Trade-off discussions
    - Transparent risk reporting
    - Data-driven decisions`,
    hints: [
      'What\'s truly critical vs nice-to-have?',
      'How can automation help?',
      'What trade-offs are acceptable?'
    ],
    tips: [
      'Risk-based testing is key',
      'Automate early and often',
      'Partner with development, not gatekeep quality'
    ],
    tags: ['Strategy', 'Risk Management', 'Agile']
  },

  // SENIOR-LEVEL: Leadership
  {
    id: 'sr-lead-001',
    question: 'How would you build and mentor a high-performing QA team?',
    category: 'leadership',
    level: 'senior',
    difficulty: 'hard',
    expectedAnswer: `Building a strong QA team requires multiple approaches:

Recruitment & Hiring:
    - Define clear role expectations
    - Assess both technical and soft skills
    - Look for growth potential
    - Build a diverse team
    - Competitive compensation

Onboarding:
    - Structured onboarding program
    - Clear documentation
    - Mentorship assignments
    - Gradual responsibility increase
    - 30/60/90 day check-ins

Skill Development:
    - Regular training programs
    - Conference attendance
    - Certification support
    - Internal knowledge sharing
    - Hands-on projects
    - Stretch assignments

Career Development:
    - Clear career paths
    - Individual development plans
    - Regular feedback and 1-on-1s
    - Promotion opportunities
    - Leadership opportunities

Team Culture:
    - Psychological safety
    - Celebrate successes
    - Share learnings from failures
    - Collaborative environment
    - Inclusive decision-making

Technical Excellence:
    - Code quality standards
    - Best practices enforcement
    - Technology choices
    - Continuous learning
    - Tool and framework updates

Engagement & Motivation:
    - Meaningful work
    - Autonomy and ownership
    - Clear goals and expectations
    - Recognition and rewards
    - Work-life balance

Retention:
    - Competitive compensation
    - Growth opportunities
    - Flexible working
    - Health and wellness
    - Transparent communication

Performance Management:
    - Clear metrics and expectations
    - Regular feedback
    - Constructive discussions
    - Development focused
    - Fair evaluation process`,
    hints: [
      'What makes a team high-performing?',
      'How do you develop talent?',
      'What drives retention?'
    ],
    tips: [
      'Invest in people first',
      'Lead by example',
      'Create space for growth'
    ],
    tags: ['Leadership', 'Team Building', 'Management']
  },

  // LEAD-LEVEL: Leadership
  {
    id: 'lead-lead-001',
    question: 'How would you define and execute a quality vision for an organization?',
    category: 'leadership',
    level: 'lead',
    difficulty: 'hard',
    expectedAnswer: `Defining and executing a quality vision requires strategic leadership:

Vision Definition:
    - Understand business strategy
    - Assess current state
    - Identify gaps and opportunities
    - Define quality goals
    - Create compelling narrative
    - Get stakeholder buy-in

Strategic Planning:
    - Break vision into roadmap
    - Define key initiatives
    - Set measurable outcomes
    - Identify dependencies
    - Resource planning
    - Timeline and milestones

Organizational Alignment:
    - Communicate vision clearly
    - Align with development
    - Gain executive support
    - Build coalition of champions
    - Cross-functional collaboration
    - Shared ownership

Capability Building:
    - Assess current capabilities
    - Identify skill gaps
    - Training and development
    - Tool and process improvements
    - Infrastructure investment
    - Team expansion

Implementation:
    - Phased rollout
    - Pilot programs
    - Quick wins for momentum
    - Change management
    - Feedback loops
    - Iterative refinement

Metrics & Accountability:
    - Define success metrics
    - Track progress
    - Regular reviews
    - Report to leadership
    - Adjust as needed
    - Celebrate milestones

Sustainability:
    - Embed in culture
    - Continuous improvement
    - Knowledge transfer
    - Process documentation
    - Team empowerment
    - Long-term thinking

Leadership:
    - Inspire and motivate
    - Model desired behaviors
    - Remove obstacles
    - Develop future leaders
    - Transparent communication
    - Vulnerability and learning`,
    hints: [
      'How do you get everyone aligned?',
      'What makes change stick?',
      'How do you measure success?'
    ],
    tips: [
      'Start with clear communication',
      'Celebrate early wins',
      'Make quality everyone\'s responsibility'
    ],
    tags: ['Strategic Leadership', 'Vision', 'Transformation']
  },
  {
    id: 'lead-lead-002',
    question: 'Describe your approach to building a quality culture across the entire organization.',
    category: 'leadership',
    level: 'lead',
    difficulty: 'hard',
    expectedAnswer: `Building quality culture is foundational to organizational success:

Foundation - Shared Values:
    - Quality is everyone's responsibility
    - Excellence over speed
    - Learning and continuous improvement
    - Transparency and honesty
    - Collaboration and trust

From the Top:
    - Executive commitment
    - Quality in mission statement
    - Resource allocation
    - Policy and processes
    - Recognition and rewards
    - Leading by example

Developer Engagement:
    - Quality in hiring criteria
    - Code quality standards
    - Testing expectations
    - Peer review culture
    - Shared ownership
    - Incentive alignment

QA Team Leadership:
    - Consultative approach
    - Partnership, not gatekeeping
    - Accessibility and support
    - Skill development
    - Tool investment
    - Continuous learning

Processes & Systems:
    - Clear quality gates
    - Automated quality checks
    - Quality metrics visibility
    - Definition of done
    - Testing practices
    - Continuous integration

Communication:
    - Regular quality updates
    - Transparent reporting
    - Learning from failures
    - Celebrating successes
    - Open dialogue
    - Feedback mechanisms

Continuous Improvement:
    - Retrospectives and reviews
    - Root cause analysis
    - Process optimization
    - Tool evaluation
    - Knowledge sharing
    - Experimentation

Measurement:
    - Quality metrics
    - Business impact
    - Team satisfaction
    - Process adherence
    - Trend analysis
    - Data-driven decisions

Resilience:
    - Accept imperfection
    - Learn from bugs
    - Blameless culture
    - Sustainable pace
    - Preventing burnout
    - Long-term perspective`,
    hints: [
      'How do you make quality everyone\'s job?',
      'What prevents quality culture from sticking?',
      'How do you maintain it long-term?'
    ],
    tips: [
      'Culture change takes time and persistence',
      'Lead by example consistently',
      'Reinforce values through systems and processes'
    ],
    tags: ['Culture', 'Organization', 'Change Leadership']
  },

  // LEAD-LEVEL: Scenario-Based
  {
    id: 'lead-scenario-001',
    question: 'A critical production bug was missed by QA. How do you handle this situation and prevent future occurrences?',
    category: 'scenario-based',
    level: 'lead',
    difficulty: 'hard',
    expectedAnswer: `Handling production escapes requires leadership and systemic thinking:

Immediate Response:
    - Acknowledge the issue
    - Support the team (no blame)
    - Help customers/support team
    - Assess impact
    - Begin investigation
    - Communicate transparently

Investigation:
    - Root cause analysis
    - Why was it missed?
    - What assumptions failed?
    - When could it have been caught?
    - What were the barriers?
    - Document findings

Learning & Improvement:
    - Share findings with team
    - Identify systemic issues
    - Not about individual failure
    - Focus on prevention
    - What can we do differently?
    - Update processes if needed

Team Management:
    - Support affected team members
    - No scapegoating
    - Reinforce learning mindset
    - Restore confidence
    - Regular check-ins
    - Psychological safety

Process Improvements:
    - Enhance test coverage
    - Improve test design
    - Add monitoring/alerting
    - Staging environment changes
    - Definition of done updates
    - Automated quality gates

Communication:
    - Transparent incident report
    - Timeline and impact
    - Root cause
    - Actions taken
    - Prevention measures
    - Follow-up timeline

Follow-up:
    - Verify fixes are effective
    - Monitor for recurrence
    - Update documentation
    - Share lessons learned
    - Team retrospective
    - Celebrate recovery

Long-term Prevention:
    - Risk-based testing
    - Observability and monitoring
    - Customer feedback loops
    - Feature flags for rollback
    - Chaos engineering
    - Continuous delivery practices`,
    hints: [
      'How do you turn this into a learning opportunity?',
      'What systemic improvements prevent recurrence?',
      'How do you maintain team morale?'
    ],
    tips: [
      'Blameless post-mortems work better',
      'Focus on systems, not individuals',
      'This builds trust and psychological safety'
    ],
    tags: ['Crisis Management', 'Leadership', 'Learning']
  }
];

export const getQuestionsByLevel = (level: QALevel): InterviewQuestion[] => {
  return interviewQuestions.filter(q => q.level === level);
};

export const getQuestionsByCategory = (category: InterviewCategory): InterviewQuestion[] => {
  return interviewQuestions.filter(q => q.category === category);
};

export const getQuestionsByLevelAndCategory = (level: QALevel, category: InterviewCategory): InterviewQuestion[] => {
  return interviewQuestions.filter(q => q.level === level && q.category === category);
};

export const getCategoriesByLevel = (level: QALevel): InterviewCategory[] => {
  const categories = new Set<InterviewCategory>();
  interviewQuestions
    .filter(q => q.level === level)
    .forEach(q => categories.add(q.category));
  return Array.from(categories).sort();
};
