import { type CartItem } from './cart';

export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentIntentId: string;
  status: OrderStatus;
  createdAt: Date;
}
