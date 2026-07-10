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
      <span className="step-badge">Exercise A</span>
      <h1>Unit Test Generation</h1>
      <PageMeta duration="25 min" difficulty="intermediate" />
      <p className="page-lead">
        Unit tests are where Copilot delivers the most immediate value — they are
        self-contained, predictable in structure, and follow well-known patterns.
        In this exercise you will use Copilot to generate a full suite for{' '}
        <code>calculateDiscount()</code>, review every suggestion critically, and
        expose three bugs that weak assertions miss.
      </p>

      <ExerciseRepoCallout path="/workshop/unit-testing" />

      <div className="workshop-flow-nav" aria-label="Session jump links">
        <a href="#unit-generate">Jump to generation</a>
        <a href="#unit-exercise">Jump to exercise</a>
        <a href="#unit-debrief">Jump to debrief</a>
      </div>

      <ArchDiagram
        title="Unit Test Generation Flow"
        nodes={[
          { label: 'calculateDiscount.ts', icon: '📄' },
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
            <td>"Write tests for calculateDiscount"</td>
            <td>Happy-path only, <code>toBeTruthy()</code> assertions that miss bugs</td>
          </tr>
          <tr>
            <td>⚠️ Better</td>
            <td>"Write Jest unit tests for calculateDiscount with SAVE10 and FLAT5"</td>
            <td>Correct structure, may miss boundary and negative cases</td>
          </tr>
          <tr>
            <td>✅ Best</td>
            <td>"Write Jest unit tests for calculateDiscount. Cover: SAVE10 (10% off), FLAT5 ($5 off orders ≥ $20), unknown codes, case-insensitivity, and the negative-total clamp."</td>
            <td>Targeted, boundary-aware, ready to review</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 1 — Explore the Function Under Test</h2>
      <CodeBlock language="typescript">{`// src/services/calculateDiscount.ts
export interface DiscountInput {
  subtotal: number;
  code: string;
}

export interface DiscountResult {
  discountAmount: number;
  finalTotal: number;
}

// Active discount codes — see .copilot/context/domain-rules.md for full rules
// SAVE10 : 10% off,  no minimum
// FLAT5  : $5 off,   $20 minimum order
// EXPIRED: 15% off,  expired — no longer applied
export function calculateDiscount({ subtotal, code }: DiscountInput): DiscountResult {
  // implementation hidden — your tests will verify the contract
}`}</CodeBlock>

      <div className="callout callout-info">
        <strong>💡 Context tip</strong> — Attach{' '}
        <code>#file:.copilot/context/domain-rules.md</code> to your Copilot Chat
        prompt so it knows the discount rules before generating assertions.
      </div>

      <h2 id="unit-generate">Step 2 — Generate Tests with Copilot</h2>
      <p>Select <code>calculateDiscount.ts</code>, open Copilot Chat, and use this prompt:</p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'bash',
          code: `You are a senior engineer writing Jest unit tests for a TypeScript Node.js project.

Context files:
- #file:src/services/calculateDiscount.ts
- #file:.copilot/context/domain-rules.md

Write a complete Jest test suite for \`calculateDiscount\` that:

1. Tests the golden path (valid inputs → expected outputs with exact values)
2. Tests every boundary condition listed in the domain rules
3. Tests every error path (invalid input, edge cases, constraint violations)
4. Uses the AAA pattern (Arrange / Act / Assert) with a blank line between sections
5. Names each test: "<subject> <condition> <expected outcome>"
6. Uses .toBe() for primitives and .toEqual() for objects — never toBeDefined() or toBeTruthy()
7. Covers negative cases — what happens when the function receives invalid or extreme input?

Do NOT:
- Mock the function under test
- Write tests that always pass regardless of the implementation
- Use toBeTruthy() or toBeDefined() as the primary assertion

Paste the output into tests/unit/calculateDiscount.test.ts`,
        },
        {
          label: 'Python / pytest',
          language: 'bash',
          code: `Write pytest unit tests for calculate_discount() in Python.
Cover:
- SAVE10 deducts exactly 10% of the subtotal
- FLAT5 deducts $5.00 from orders >= $20
- FLAT5 returns zero discount below $20 minimum
- Unknown codes return zero discount
- Codes are case-insensitive
- final_total never goes below 0`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'bash',
          code: `Write JUnit 5 unit tests for calculateDiscount() in Java.
Use @ParameterizedTest where appropriate.
Cover: SAVE10 (10%), FLAT5 ($5 off, $20 min), unknown code,
case-insensitive matching, and the non-negative finalTotal invariant.
Use @DisplayName to name each test for the behavior.`,
        },
      ]} />

      <h2>Step 3 — Review the Generated Output</h2>
      <p>
        Copilot should produce tests that look something like this. Read them
        carefully before accepting — there are common problems to look for.
      </p>
      <LanguageTabs tabs={[
        {
          label: 'TypeScript / Jest',
          language: 'typescript',
          code: `// tests/unit/calculateDiscount.test.ts  (Copilot-generated — review before accepting)
import { calculateDiscount } from '../../src/services/calculateDiscount';

describe('calculateDiscount', () => {
  it('SAVE10 deducts exactly 10% of the subtotal', () => {
    const result = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
    expect(result.discountAmount).toBe(10);
    expect(result.finalTotal).toBe(90);
  });

  it('FLAT5 deducts $5 from a $50 order', () => {
    const result = calculateDiscount({ subtotal: 50, code: 'FLAT5' });
    expect(result.discountAmount).toBe(5);
    expect(result.finalTotal).toBe(45);
  });

  it('FLAT5 is not applied when subtotal is below the $20 minimum', () => {
    const result = calculateDiscount({ subtotal: 15, code: 'FLAT5' });
    expect(result.discountAmount).toBe(0);
    expect(result.finalTotal).toBe(15);
  });

  it('returns zero discount for an unknown code', () => {
    const result = calculateDiscount({ subtotal: 100, code: 'INVALID' });
    expect(result.discountAmount).toBe(0);
    expect(result.finalTotal).toBe(100);
  });

  it('codes are case-insensitive', () => {
    const result = calculateDiscount({ subtotal: 100, code: 'save10' });
    expect(result.discountAmount).toBe(10);
    expect(result.finalTotal).toBe(90);
  });

  it('finalTotal is never negative when discount exceeds subtotal', () => {
    const result = calculateDiscount({ subtotal: 3, code: 'FLAT5' });
    expect(result.finalTotal).toBeGreaterThanOrEqual(0);
    expect(result.discountAmount).toBeLessThanOrEqual(3);
  });
});`,
        },
        {
          label: 'Python / pytest',
          language: 'python',
          code: `# tests/unit/test_calculate_discount.py  (Copilot-generated — review before accepting)
import pytest
from src.services.calculate_discount import calculate_discount

def test_save10_deducts_10_percent():
    result = calculate_discount(subtotal=100, code='SAVE10')
    assert result['discount_amount'] == 10
    assert result['final_total'] == 90

def test_flat5_deducts_five_dollars():
    result = calculate_discount(subtotal=50, code='FLAT5')
    assert result['discount_amount'] == 5
    assert result['final_total'] == 45

def test_flat5_not_applied_below_minimum():
    result = calculate_discount(subtotal=15, code='FLAT5')
    assert result['discount_amount'] == 0
    assert result['final_total'] == 15

def test_unknown_code_returns_zero_discount():
    result = calculate_discount(subtotal=100, code='INVALID')
    assert result['discount_amount'] == 0
    assert result['final_total'] == 100

def test_codes_are_case_insensitive():
    result = calculate_discount(subtotal=100, code='save10')
    assert result['discount_amount'] == 10

def test_final_total_is_never_negative():
    result = calculate_discount(subtotal=3, code='FLAT5')
    assert result['final_total'] >= 0`,
        },
        {
          label: 'Java / JUnit 5',
          language: 'typescript',
          code: `// CalculateDiscountTest.java  (Copilot-generated — review before accepting)
@ExtendWith(MockitoExtension.class)
class CalculateDiscountTest {

    @Test
    @DisplayName("SAVE10 deducts exactly 10% of the subtotal")
    void save10_deducts_ten_percent() {
        DiscountResult result = calculateDiscount(100, "SAVE10");
        assertThat(result.getDiscountAmount()).isEqualByComparingTo("10");
        assertThat(result.getFinalTotal()).isEqualByComparingTo("90");
    }

    @Test
    @DisplayName("FLAT5 is not applied when subtotal is below $20 minimum")
    void flat5_skipped_below_minimum() {
        DiscountResult result = calculateDiscount(15, "FLAT5");
        assertThat(result.getDiscountAmount()).isEqualByComparingTo("0");
        assertThat(result.getFinalTotal()).isEqualByComparingTo("15");
    }

    @Test
    @DisplayName("finalTotal is never negative")
    void finalTotal_never_negative() {
        DiscountResult result = calculateDiscount(3, "FLAT5");
        assertThat(result.getFinalTotal()).isGreaterThanOrEqualTo(BigDecimal.ZERO);
    }
}`,
        },
      ]} />

      <div className="callout callout-info">
        <strong>🔍 Common issues to look for in generated unit tests:</strong>
        <ul>
          <li><code>toBeTruthy()</code> or <code>toBeDefined()</code> instead of exact value assertions — these mask bugs</li>
          <li>Tests that only check the happy path — boundaries and edge cases are where bugs hide</li>
          <li>Missing the negative-total invariant test — the clamp to 0 is a real business rule</li>
          <li>No case-insensitivity test — easy to miss, commonly broken</li>
        </ul>
      </div>

      <h2>Run the Tests</h2>
      <CodeBlock language="bash">{`npx jest tests/unit/calculateDiscount.test.ts --verbose`}</CodeBlock>
      <div className="callout callout-info">
        <strong>💡 Expect failures, not green</strong> — <code>calculateDiscount.ts</code>{' '}
        still has its 3 seeded bugs. Strong, exact-value assertions like the ones above{' '}
        <em>should</em> fail against it. If you see all green here, your assertions are
        too loose to catch the bugs — go back and tighten them.
      </div>
      <VerifyBlock>{`FAIL tests/unit/calculateDiscount.test.ts
  calculateDiscount
    ✕ SAVE10 deducts exactly 10% of the subtotal (2 ms)
    ✓ FLAT5 deducts $5 from a $50 order (1 ms)
    ✕ FLAT5 is not applied when subtotal is below the $20 minimum (1 ms)
    ✓ returns zero discount for an unknown code (1 ms)
    ✕ codes are case-insensitive (1 ms)
    ✕ finalTotal is never negative when discount exceeds subtotal (1 ms)

  ● calculateDiscount › SAVE10 deducts exactly 10% of the subtotal

    expect(received).toBe(expected)

    Expected: 10
    Received: 100   // BUG 1 — divides by 10 instead of 100

  ● calculateDiscount › FLAT5 is not applied when subtotal is below the $20 minimum

    expect(received).toBe(expected)

    Expected: 0
    Received: 5     // BUG 2 — missing $20 minimum-order guard

  ● calculateDiscount › codes are case-insensitive

    expect(received).toBe(expected)

    Expected: 10
    Received: 100   // BUG 1 again, via the lowercase path

  ● calculateDiscount › finalTotal is never negative when discount exceeds subtotal

    expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 0
    Received:    -2 // BUG 3 — finalTotal is never clamped to 0

Tests: 4 failed, 2 passed, 6 total`}</VerifyBlock>

      <div id="unit-exercise">
      <TimedExercise minutes={15} title="Hands-on Challenge — Find and Fix Weak Tests">
        <p>
          Open <code>tests/unit/calculateDiscount.weak.test.ts</code>. These
          tests were AI-generated with a vague prompt. Each one passes today —
          but none of them would catch the three bugs hidden in the
          implementation. Find all three bugs and rewrite the assertions.
        </p>

        <h3>The Weak Tests (what Copilot produced)</h3>
        <CodeBlock language="typescript">{`// calculateDiscount.weak.test.ts — passes today but proves almost nothing

it('SAVE10 produces a discount', () => {
  const r = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
  expect(r.discountAmount).toBeTruthy();   // ← passes even if discount is $100
});

it('FLAT5 processes the order', () => {
  const r = calculateDiscount({ subtotal: 15, code: 'FLAT5' });
  expect(r).toBeDefined();                 // ← passes even when discount should be 0
});

it('handles a discount code', () => {
  const r = calculateDiscount({ subtotal: 3, code: 'FLAT5' });
  expect(r.finalTotal).toBeDefined();      // ← passes even if finalTotal is negative
});`}</CodeBlock>

        <Collapsible title="Hint: What each weak test misses" variant="hint">
          <ul>
            <li><strong>Bug 1</strong> — <code>toBeTruthy()</code> passes for any non-zero value. If the implementation
              deducts 100% instead of 10%, this test still passes. Assert the exact amount: <code>toBe(10)</code>.</li>
            <li><strong>Bug 2</strong> — <code>subtotal: 15</code> is below the $20 minimum; <code>FLAT5</code> should
              not apply. <code>toBeDefined()</code> passes regardless. Assert <code>discountAmount</code> is <code>0</code>.</li>
            <li><strong>Bug 3</strong> — <code>subtotal: 3</code> is below the $5 flat deduction; without the clamp,
              <code>finalTotal</code> could be <code>-2</code>. <code>toBeDefined()</code> misses this entirely.
              Assert <code>finalTotal</code> <code>toBeGreaterThanOrEqual(0)</code>.</li>
          </ul>
        </Collapsible>

        <Collapsible title="Strong Rewrites" variant="solution">
          <CodeBlock language="typescript">{`// Bug 1 fixed — assert exact amount, not just truthy
it('SAVE10 deducts exactly 10%, not 100%', () => {
  const r = calculateDiscount({ subtotal: 100, code: 'SAVE10' });
  expect(r.discountAmount).toBe(10);
  expect(r.finalTotal).toBe(90);
});

// Bug 2 fixed — assert the minimum-order guard works
it('FLAT5 is skipped when subtotal is below the $20 minimum', () => {
  const r = calculateDiscount({ subtotal: 15, code: 'FLAT5' });
  expect(r.discountAmount).toBe(0);
  expect(r.finalTotal).toBe(15);
});

// Bug 3 fixed — assert the non-negative finalTotal invariant
it('finalTotal is never negative when discount exceeds subtotal', () => {
  const r = calculateDiscount({ subtotal: 3, code: 'FLAT5' });
  expect(r.finalTotal).toBeGreaterThanOrEqual(0);
  expect(r.discountAmount).toBeLessThanOrEqual(3);
});`}</CodeBlock>
        </Collapsible>

        <Collapsible title="Bonus: Prompt Copilot to improve weak tests" variant="bonus">
          <p>
            Select the three weak tests in Copilot Chat and paste this prompt:
          </p>
          <CodeBlock language="bash">{`Review these tests. Replace any toBeTruthy/toBeDefined assertions with
specific value matchers. Add the missing boundary and minimum-order cases.
Each test name should describe the behavior it proves, not the code path.`}</CodeBlock>
        </Collapsible>
      </TimedExercise>
      </div>

      <TimedExercise minutes={10} title="Bonus: Prompt Engineering Challenge">
        <p>
          Write a prompt that produces <strong>all six strong tests</strong> from
          the generated output above in a single Copilot Chat turn. Then identify
          what Copilot still won't get right even with your best prompt.
        </p>
        <Collapsible title="Hint: What a strong prompt must include" variant="hint">
          <ul>
            <li>Attach <code>#file:calculateDiscount.ts</code> and <code>#file:.copilot/context/domain-rules.md</code></li>
            <li>List every case explicitly: golden path, boundary (exactly at $20), below minimum, unknown code, case-insensitivity, negative clamp</li>
            <li>Specify the assertion style: <em>"use toBe() for exact values, not toBeTruthy or toBeDefined"</em></li>
            <li>Specify test names: <em>"name each test for the behavior it proves"</em></li>
          </ul>
        </Collapsible>
        <Collapsible title="What Copilot still won't get right" variant="bonus">
          <ul>
            <li><strong>The EXPIRED code</strong> — Copilot won't know it exists unless you add it to the prompt</li>
            <li><strong>Exactly-at-minimum boundary</strong> — <code>subtotal: 20</code> with FLAT5 should apply; Copilot may skip this unless explicitly asked</li>
            <li><strong>Domain intent</strong> — whether a 10% discount on a $3 order is a business error or a valid case requires your judgment, not Copilot's</li>
          </ul>
        </Collapsible>
      </TimedExercise>

      <TimedExercise minutes={20} title="Bonus: More Services to Practice On">
        <p>
          <code>calculateDiscount</code> is one pure function. The rest of the checkout pipeline
          has its own service classes, each already stubbed with <code>it.todo</code> placeholders
          in <code>tests/unit/</code> — not timed, not required, just extra reps if you finish early
          or want more practice with the prompt template from{' '}
          <code>.copilot/skills/unit-testing.md</code> on real classes instead of one function.
        </p>
        <table className="info-table">
          <thead>
            <tr>
              <th>File</th>
              <th>What to practice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>tests/unit/cartService.test.ts</code></td>
              <td>Add/remove items, merge duplicate products, subtotal calculation, <code>ITEM_NOT_FOUND</code></td>
            </tr>
            <tr>
              <td><code>tests/unit/discountService.test.ts</code></td>
              <td>Same discount rules as Exercise A, but testing the class + repository instead of a pure function — compare how the prompt changes</td>
            </tr>
            <tr>
              <td><code>tests/unit/fraudService.test.ts</code></td>
              <td>Risk-scoring thresholds and country blocks — clear numeric rules make great Copilot prompts</td>
            </tr>
            <tr>
              <td><code>tests/unit/paymentService.test.ts</code></td>
              <td>The <code>pending → captured → refunded</code> state machine and its invalid-transition errors</td>
            </tr>
          </tbody>
        </table>
        <Collapsible title="Hint: Reuse the same prompt template" variant="hint">
          <p>
            Swap the target file and function/class name into the template from{' '}
            <code>.copilot/skills/unit-testing.md</code>:
          </p>
          <CodeBlock language="bash">{`Context files:
- #file:src/services/<serviceName>.ts
- #file:.copilot/context/domain-rules.md

Write a complete Jest test suite for <ServiceClass> that:
1. Tests the golden path with exact expected values
2. Tests every boundary condition from the domain rules
3. Tests every error path (thrown ApiError codes)
4. Uses AAA pattern, one assertion group per test
5. Uses .toBe()/.toEqual() — never toBeTruthy()/toBeDefined()`}</CodeBlock>
        </Collapsible>
      </TimedExercise>

      <div className="troubleshooting-section">
        <h2>🔧 Troubleshooting</h2>
        <Collapsible title="Tests pass but bugs are present" variant="hint">
          <p>
            Run the weak test file against a broken implementation:{' '}
            <code>npx jest calculateDiscount.weak.test.ts</code>. All three tests
            should still pass despite the bugs — that is the point of the
            exercise. The strong tests should detect all three failures.
          </p>
        </Collapsible>
        <Collapsible title="TypeScript cannot find calculateDiscount" variant="hint">
          <p>
            Check your import path is relative to the test file location:{' '}
            <code>import {'{ calculateDiscount }'} from '../../src/services/calculateDiscount'</code>.
            Run <code>npx jest --verbose</code> to see the full import error.
          </p>
        </Collapsible>
      </div>

      <div id="unit-debrief" className="takeaways-section">
        <h2>Key Takeaways</h2>
        <div className="summary-card">
          <ul>
            <li>Specific prompts with attached context files produce better, targeted test suggestions</li>
            <li>Always assert exact values — <code>toBeTruthy()</code> and <code>toBeDefined()</code> hide bugs</li>
            <li>Boundary cases (exactly at minimum, zero, negative) are where real bugs live</li>
            <li>Run tests against a broken implementation to verify they actually catch the bug</li>
            <li>Copilot drafts the cases; you validate the intent and the assertions</li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
);

export default UnitTesting;
