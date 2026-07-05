/**
 * Notification service tests.
 *
 * Contains one deliberately flaky test (marked) as a teaching example.
 * The flaky test demonstrates why timing-based assertions are dangerous in CI.
 */

import { NotificationService } from '../../src/services/notificationService';

const basePayload = {
  userId: 'user-1',
  type: 'receipt' as const,
  email: 'alice@example.com',
  subject: 'Your receipt',
  body: 'Thank you for your purchase.',
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  // TODO: use Copilot to generate this test
  it.todo('logs a receipt notification and returns a NotificationLog');

  // TODO: use Copilot to generate this test
  it.todo('stores notifications so they can be retrieved by userId');

  // TODO: use Copilot to generate this test
  it.todo('supports multiple notification types (receipt, order_confirmation, refund)');

  // TODO: use Copilot to generate this test
  it.todo('reset() clears all stored notifications');

  /**
   * FLAKY TEST DEMO — do not fix; leave as-is for the workshop discussion.
   *
   * This test asserts that `sentAt` is within 50 ms of when the test started.
   * On a loaded CI runner the process can be paused for longer than that between
   * `Date.now()` and the `send()` call, causing a random failure.
   *
   * Workshop question: "AI wrote this test — would you trust it in CI? Why not?"
   * Fix: mock time with `jest.useFakeTimers()` or assert `.toBeInstanceOf(Date)`
   *      instead of asserting how recent the timestamp is.
   */
  it('🚨 FLAKY: sentAt timestamp is within 50 ms of the call (demo — see comment)', () => {
    const before = Date.now();
    const log = service.send(basePayload);
    const after = Date.now();

    // This assertion is timing-dependent — it fails when the CI runner is slow.
    expect(log.sentAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(log.sentAt.getTime()).toBeLessThanOrEqual(after + 50); // arbitrary 50 ms window
  });
});
