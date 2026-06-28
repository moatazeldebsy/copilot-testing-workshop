import crypto from 'node:crypto';
import { type NotificationLog, type NotificationPayload } from '../models/notification';

export class NotificationService {
  private readonly logs: NotificationLog[] = [];

  send(payload: NotificationPayload): NotificationLog {
    const log: NotificationLog = {
      id: crypto.randomUUID(),
      userId: payload.userId,
      type: payload.type,
      email: payload.email,
      subject: payload.subject,
      sentAt: new Date(),
    };

    this.logs.push(log);
    return log;
  }

  getLogsForUser(userId: string): NotificationLog[] {
    return this.logs.filter((l) => l.userId === userId);
  }

  reset(): void {
    this.logs.length = 0;
  }
}
