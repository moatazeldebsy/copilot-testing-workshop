export interface EmailService {
  sendWelcome(email: string): Promise<void>;
  sendPasswordReset(email: string, token: string): Promise<void>;
}

export class NoopEmailService implements EmailService {
  async sendWelcome(): Promise<void> {
    return undefined;
  }

  async sendPasswordReset(): Promise<void> {
    return undefined;
  }
}