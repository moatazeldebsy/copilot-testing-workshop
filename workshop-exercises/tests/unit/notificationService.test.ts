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

  it('logs a receipt notification and returns a NotificationLog', () => {
    // Act
    const log = service.send(basePayload);

    // Assert
    expect(log.id).toBeDefined();
    expect(log.userId).toBe('user-1');
    expect(log.type).toBe('receipt');
    expect(log.email).toBe('alice@example.com');
    expect(log.subject).toBe('Your receipt');
    expect(log.sentAt).toBeInstanceOf(Date);
  });

  it('stores notifications so they can be retrieved by userId', () => {
    // Arrange
    service.send(basePayload);
    service.send({ ...basePayload, userId: 'user-2' });

    // Act
    const logsForUser1 = service.getLogsForUser('user-1');

    // Assert
    expect(logsForUser1).toHaveLength(1);
    expect(logsForUser1[0].userId).toBe('user-1');
  });

  it('supports multiple notification types (receipt, order_confirmation, refund)', () => {
    // Act
    service.send({ ...basePayload, type: 'receipt' });
    service.send({ ...basePayload, type: 'order_confirmation' });
    service.send({ ...basePayload, type: 'refund' });

    // Assert
    const types = service.getLogsForUser('user-1').map((log) => log.type);
    expect(types).toEqual(['receipt', 'order_confirmation', 'refund']);
  });

  it('reset() clears all stored notifications', () => {
    // Arrange
    service.send(basePayload);

    // Act
    service.reset();

    // Assert
    expect(service.getLogsForUser('user-1')).toEqual([]);
  });

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
