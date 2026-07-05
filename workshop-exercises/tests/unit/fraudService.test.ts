/**
 * BONUS — FraudService unit tests (not a timed exercise)
 *
 * Fraud check is covered at the API level in Exercise C (checkout.test.ts).
 * Use this file if you finish early — FraudService has clear scoring rules
 * that make great Copilot prompts (amount thresholds, country blocks, item counts).
 */

import { FraudService } from '../../src/services/fraudService';

describe('FraudService', () => {
  let fraudService: FraudService;

  beforeEach(() => {
    fraudService = new FraudService();
  });

  // TODO: use Copilot to generate this test
  it.todo('approves a low-risk order');

  // TODO: use Copilot to generate this test
  it.todo('flags an order over $1000 as high risk');

  // TODO: use Copilot to generate this test
  it.todo('flags an order with more than 20 items');

  // TODO: use Copilot to generate this test
  it.todo('rejects an order from a high-risk country');

  // TODO: use Copilot to generate this test
  it.todo('returns the correct riskScore and reasons array');
});
