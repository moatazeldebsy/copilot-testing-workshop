import { type PaymentIntent } from '../models/payment';

export class PaymentRepository {
  private readonly intents = new Map<string, PaymentIntent>();

  save(intent: PaymentIntent): PaymentIntent {
    this.intents.set(intent.id, intent);
    return intent;
  }

  findById(id: string): PaymentIntent | null {
    return this.intents.get(id) ?? null;
  }

  reset(): void {
    this.intents.clear();
  }
}
