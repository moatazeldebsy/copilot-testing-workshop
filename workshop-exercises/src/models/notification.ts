export type NotificationType = 'receipt' | 'order_confirmation' | 'refund';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  email: string;
  subject: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationLog {
  id: string;
  userId: string;
  type: NotificationType;
  email: string;
  subject: string;
  sentAt: Date;
}
