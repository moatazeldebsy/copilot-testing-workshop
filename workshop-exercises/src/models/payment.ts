export type PaymentStatus = 'pending' | 'captured' | 'refunded' | 'failed';

export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChargeDto {
  userId: string;
  amount: number;
  currency?: string;
}

export interface RefundDto {
  reason?: string;
}
