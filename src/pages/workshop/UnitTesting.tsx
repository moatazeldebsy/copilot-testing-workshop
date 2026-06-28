import React from 'react';
import Layout from '../../components/Layout';
import CodeBlock from '../../components/CodeBlock';
import PageMeta from '../../components/PageMeta';
import VerifyBlock from '../../components/VerifyBlock';
import Collapsible from '../../components/Collapsible';
import ArchDiagram from '../../components/ArchDiagram';
import LanguageTabs from '../../components/LanguageTabs';
import TimedExercise from '../../components/TimedExercise';
import ExerciseRepoCallout from '../../components/ExerciseRepoCallout';

const UnitTesting: React.FC = () => (
  <Layout>
    <div className="workshop-page">
      <span className="step-badge">Step 4</span>
      <h1>Unit Test Generation</h1>
      <PageMeta duration="25 min" difficulty="intermediate" />
      <p className="page-lead">
        Unit tests are where Copilot delivers the most immediate value — they
        are self-contained, predictable in structure, and follow well-known
        patterns that Copilot knows well. In this step you will use Copilot to
        generate a full unit test suite, review every suggestion critically, and
        fix what it gets wrong.
      </p>

      <ExerciseRepoCallout path="/workshop/unit-testing" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#unit-generate">Jump to generation</a>
        <a href="#unit-exercise">Jump to exercise</a>
        <a href="#unit-debrief">Jump to debrief</a>
      </div>

      <div className="callout callout-info">
        <strong>Presenter checkpoint</strong>
        Live pacing target: 5 min concept framing, 10 min generation and review, 10 min hands-on and debrief.
      </div>

      <div className="callout callout-info">
        <strong>2-minute speaker script</strong>
        "Unit tests are where Copilot gives immediate ROI. We will draft quickly,
        then upgrade quality by tightening assertions and edge cases. A fast draft is useful,
        but only if it fails when behavior is wrong."
      </div>

      <ArchDiagram
        title="Unit Test Generation Flow"
        nodes={[
          { label: 'Source File', icon: '📄' },
          { label: 'Copilot Chat', icon: '🤖' },
          { label: 'Generated Tests', icon: '🧪' },
          { label: 'Review & Fix', icon: '👀' },
          { label: 'Jest Runner', icon: '✅' },
        ]}
        connections={[
          { from: 0, to: 1, label: 'context for' },
          { from: 1, to: 2, label: 'generates' },
          { from: 2, to: 3, label: 'reviewed by' },
          { from: 3, to: 4, label: 'run in' },
        ]}
      />

      <h2>The Prompt-First Approach</h2>
      <p>
        The quality of Copilot's output depends heavily on the quality of your
        prompt. Vague prompts produce vague tests.
      </p>
      <table className="info-table">
        <thead>
          <tr>
            <th>Prompt Quality</th>
            <th>Example</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>❌ Too vague</td>
            <td>"Write tests for userService"</td>
            <td>Generic happy-path only, wrong method names</td>
          </tr>
          <tr>
            <td>⚠️ Better</td>
            <td>"Write Jest unit tests for UserService.createUser"</td>
            <td>Correct structure, may miss edge cases</td>
          </tr>
          <tr>
            <td>✅ Best</td>
            <td>"Write Jest unit tests for UserService.createUser. Include: success case, duplicate email error, missing required field. Mock the UserRepository."</td>
            <td>Structured, targeted, ready to review</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 1 — Explore the Service Under Test</h2>
      <CodeBlock language="typescript">{`// src/services/userService.ts
import { UserRepository } from '../repositories/userRepository';
import { User, CreateUserDto } from '../models/user';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new Error('Email already registered');
    if (!dto.name || dto.name.trim() === '') throw new Error('Name is required');
    return this.repo.save({ ...dto, id: crypto.randomUUID(), createdAt: new Date() });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');
    await this.repo.delete(id);
  }
}`}</CodeBlock>

      <h2 id="unit-generate">Step 2 — Generate Tests with Copilot</h2>
      <p>Select the entire file, open Copilot Chat, and use this prompt:</p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'bash',
          code: `Write Jest unit tests for UserService in TypeScript.
Include tests for:
- createUser: success, duplicate email error, empty name error
- deleteUser: success, user not found error
Mock UserRepository with jest.fn().
Use describe/it blocks with descriptive test names.`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Write pytest unit tests for UserService in Python.
Include tests for:
- create_user: success, duplicate email error, empty name error
- delete_user: success, user not found error
Mock UserRepository with unittest.mock.MagicMock().
Use class-based or function-based tests with descriptive names.`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'bash',
          code: `Write JUnit 5 unit tests for UserService in Java.
Include tests for:
- createUser: success, duplicate email error, empty name error
- deleteUser: success, user not found error
Mock UserRepository with Mockito.
Use @ExtendWith(MockitoExtension.class) and descriptive @DisplayName annotations.`,
        },
      ]} />

      <h2>Step 3 — Review the Generated Output</h2>
      <p>
        Copilot will produce something like this. Read it carefully — there are
        common problems to find:
      </p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'typescript',
          code: `// tests/unit/userService.test.ts  (Copilot-generated — review before accepting)
import { UserService } from '../../src/services/userService';
import { UserRepository } from '../../src/repositories/userRepository';

jest.mock('../../src/repositories/userRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepo);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.save.mockResolvedValue({ id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() });

      const result = await userService.createUser({ name: 'Alice', email: 'alice@example.com' });

      expect(result.name).toBe('Alice');
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw if email already exists', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: '1', name: 'Bob', email: 'bob@example.com', createdAt: new Date() });

      await expect(userService.createUser({ name: 'Bob', email: 'bob@example.com' }))
        .rejects.toThrow('Email already registered');
    });
  });
});`,
        },
        {
          label: 'Python / pytest',
          language: 'python',
          code: `# tests/test_user_service.py  (Copilot-generated — review before accepting)
import pytest
from unittest.mock import MagicMock
from src.services.user_service import UserService

@pytest.fixture
def mock_repo():
    return MagicMock()

@pytest.fixture
def service(mock_repo):
    return UserService(mock_repo)

def test_create_user_success(service, mock_repo):
    mock_repo.find_by_email.return_value = None
    mock_repo.save.return_value = {'id': '1', 'name': 'Alice', 'email': 'alice@example.com'}

    result = service.create_user({'name': 'Alice', 'email': 'alice@example.com'})

    assert result['name'] == 'Alice'
    mock_repo.save.assert_called_once()

def test_create_user_duplicate_email_raises(service, mock_repo):
    mock_repo.find_by_email.return_value = {'id': '1', 'name': 'Bob', 'email': 'bob@example.com'}

    with pytest.raises(ValueError, match='Email already registered'):
        service.create_user({'name': 'Bob', 'email': 'bob@example.com'})`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'typescript',  // closest highlight; java not in prism bundle
          code: `// UserServiceTest.java  (Copilot-generated — review before accepting)
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("createUser — success")
    void createUser_success() {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.empty());
        User saved = new User("1", "Alice", "alice@example.com");
        when(userRepository.save(any())).thenReturn(saved);

        User result = userService.createUser(new CreateUserDto("Alice", "alice@example.com"));

        assertThat(result.getName()).isEqualTo("Alice");
        verify(userRepository).save(any());
    }

    @Test
    @DisplayName("createUser — throws when email already exists")
    void createUser_duplicateEmail_throws() {
        when(userRepository.findByEmail("bob@example.com"))
            .thenReturn(Optional.of(new User("1", "Bob", "bob@example.com")));

        assertThatThrownBy(() -> userService.createUser(new CreateUserDto("Bob", "bob@example.com")))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Email already registered");
    }
}`,
        },
      ]} />

      <div className="callout callout-info">
        <strong>🔍 Common issues to look for in generated unit tests:</strong>
        <ul>
          <li>Assertions checking only that a method was called, not what it returned</li>
          <li>Hardcoded IDs like <code>'1'</code> instead of meaningful values</li>
          <li>Missing <code>afterEach(() =&gt; jest.clearAllMocks())</code></li>
          <li>Test names that describe the mock, not the expected behaviour</li>
        </ul>
      </div>

      <h2>Step 4 — Run the Tests</h2>
      <CodeBlock language="bash">{`npx jest tests/unit/userService.test.ts --verbose`}</CodeBlock>
      <VerifyBlock>{`PASS tests/unit/userService.test.ts
  UserService
    createUser
      ✓ should create a user successfully (4 ms)
      ✓ should throw if email already exists (1 ms)
      ✓ should throw if name is empty (1 ms)
    deleteUser
      ✓ should delete an existing user (1 ms)
      ✓ should throw if user not found (1 ms)

Tests: 5 passed, 5 total`}</VerifyBlock>

      <div id="unit-exercise">
      <TimedExercise minutes={10} title="Hands-on Challenge">
        <p>
          The generated tests above are missing something important. Ask Copilot
          to add the missing test, then decide whether to accept it.
        </p>
        <Collapsible title="Hint: What is missing?" variant="hint">
          <p>
            The <code>createUser</code> tests don't verify that{' '}
            <code>mockRepo.findByEmail</code> was called with the correct email
            address. Without this assertion, the test would pass even if the
            duplicate-email check were removed from the service.
          </p>
          <p>
            Ask Copilot: <em>"Add an assertion to verify findByEmail was called with the correct argument"</em>
          </p>
        </Collapsible>
        <Collapsible title="Full Fix" variant="solution">
          <CodeBlock language="typescript">{`it('should create a user successfully', async () => {
  mockRepo.findByEmail.mockResolvedValue(null);
  mockRepo.save.mockResolvedValue({ id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() });

  const result = await userService.createUser({ name: 'Alice', email: 'alice@example.com' });

  expect(result.name).toBe('Alice');
  expect(mockRepo.findByEmail).toHaveBeenCalledWith('alice@example.com'); // ← added
  expect(mockRepo.save).toHaveBeenCalledTimes(1);
});`}</CodeBlock>
        </Collapsible>
        <Collapsible title="Bonus: Spot the flaky test risk" variant="bonus">
          <p>
            The <code>createUser</code> implementation uses{' '}
            <code>crypto.randomUUID()</code> and <code>new Date()</code>.
            How would you test that those fields are populated correctly
            without making the test time-dependent or random-dependent?
          </p>
        </Collapsible>
      </TimedExercise>
      </div>

      <TimedExercise minutes={10} title="Prompt Engineering Challenge">
        <p>
          Write a Copilot prompt that generates <strong>production-quality</strong>
          tests for the function below — then identify what's still missing even
          after you apply your best prompt.
        </p>
        <CodeBlock language="typescript">{`function processPayment(amount: number, currency: string, userId: string) {
  if (amount <= 0) throw new Error('Invalid amount');
  const fee = calculateFee(amount, currency);
  return chargeUser(userId, amount + fee);
}`}</CodeBlock>
        <Collapsible title="Hint: What should a strong prompt include?" variant="hint">
          <ul>
            <li>Specify the framework: <em>"Jest unit tests in TypeScript"</em></li>
            <li>List the cases: valid payment, <code>amount &lt;= 0</code>, unsupported currency, unknown <code>userId</code></li>
            <li>Tell it what to mock: <em>"Mock <code>calculateFee</code> and <code>chargeUser</code> with <code>jest.fn()</code>"</em></li>
            <li>Request assertion depth: <em>"assert that <code>chargeUser</code> was called with the correct total"</em></li>
          </ul>
        </Collapsible>
        <Collapsible title="Strong Prompt Example" variant="solution">
          <CodeBlock language="bash">{`Generate Jest unit tests in TypeScript for processPayment(amount, currency, userId).
Cover:
1. Valid payment — amount 150, currency 'EUR': verify chargeUser called with amount + fee
2. amount <= 0 — should throw 'Invalid amount'
3. calculateFee throws (unsupported currency) — error propagates
4. chargeUser throws (unknown userId) — error propagates
Mock calculateFee and chargeUser with jest.fn().
Use Given/When/Then test names.
Assert call arguments, not just call counts.`}</CodeBlock>
        </Collapsible>
        <Collapsible title="What Copilot still won't get right" variant="bonus">
          <ul>
            <li><strong>Fee calculation logic</strong> — Copilot doesn't know your <code>calculateFee</code> rules</li>
            <li><strong>Currency validation rules</strong> — it may guess supported currencies incorrectly</li>
            <li><strong>userId format constraints</strong> — UUID? numeric? Copilot cannot infer this</li>
            <li><strong>Idempotency</strong> — is double-charging on retry prevented? Copilot won't test this unless told</li>
          </ul>
        </Collapsible>
      </TimedExercise>

      <div className="troubleshooting-section">
        <h2>🔧 Troubleshooting</h2>
        <Collapsible title="jest.mock() path is wrong" variant="hint">
          <p>
            If Jest cannot find the module, check that the path in{' '}
            <code>jest.mock('...')</code> is relative to the test file, not the
            src directory. Run <code>npx jest --verbose</code> to see the full
            import error.
          </p>
        </Collapsible>
        <Collapsible title="TypeScript errors on mockRepo methods" variant="hint">
          <p>
            If TypeScript complains that <code>mockRepo.findByEmail</code> is
            not a function, ensure you cast the mocked class correctly:{' '}
            <code>new UserRepository() as jest.Mocked&lt;UserRepository&gt;</code>.
          </p>
        </Collapsible>
      </div>

      <div id="unit-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Specific prompts produce better, more targeted test suggestions</li>
            <li>Always check that assertions verify behaviour, not just execution</li>
            <li>Generated tests may omit call-argument assertions — add them manually</li>
            <li>Look for time/random dependencies that make tests flaky</li>
            <li>Run the tests before accepting — broken suggestions do happen</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default UnitTesting;
