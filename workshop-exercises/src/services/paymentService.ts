import crypto from 'node:crypto';
import { ApiError } from '../errors/apiError';
import { type ChargeDto, type PaymentIntent } from '../models/payment';
import { PaymentRepository } from '../repositories/paymentRepository';

export class PaymentService {
  constructor(private readonly repo: PaymentRepository) {}

  charge(dto: ChargeDto): PaymentIntent {
    if (typeof dto.amount !== 'number' || dto.amount <= 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'amount must be a positive number');
    }

    const intent: PaymentIntent = {
      id: `pi_${crypto.randomUUID()}`,
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency ?? 'usd',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.repo.save(intent);
  }

  capture(intentId: string): PaymentIntent {
    const intent = this.repo.findById(intentId);

    if (!intent) {
      throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment intent not found');
    }

    if (intent.status !== 'pending') {
      throw new ApiError(400, 'INVALID_PAYMENT_STATE', `Cannot capture a payment in '${intent.status}' state`);
    }

    return this.repo.save({ ...intent, status: 'captured', updatedAt: new Date() });
  }

  refund(intentId: string): PaymentIntent {
    const intent = this.repo.findById(intentId);

    if (!intent) {
      throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment intent not found');
    }

    if (intent.status !== 'captured') {
      throw new ApiError(400, 'INVALID_PAYMENT_STATE', `Cannot refund a payment in '${intent.status}' state`);
    }

    return this.repo.save({ ...intent, status: 'refunded', updatedAt: new Date() });
  }

  getIntent(intentId: string): PaymentIntent {
    const intent = this.repo.findById(intentId);

    if (!intent) {
      throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment intent not found');
    }

    return intent;
  }
}
