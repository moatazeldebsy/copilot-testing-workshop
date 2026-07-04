import type { CartItem } from '../src/models/cart';
import type { FraudCheckRequest } from '../src/models/fraud';

export const buildCartItem = (over: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  productId: 'prod_1',
  name: 'Workshop T-Shirt',
  price: 25,
  quantity: 1,
  ...over,
});

export const buildFraudRequest = (over: Partial<FraudCheckRequest> = {}): FraudCheckRequest => ({
  userId: 'user-123',
  orderAmount: 50,
  itemCount: 1,
  ipCountry: 'DE',
  ...over,
});

export function mockFetchOnce(body: unknown, status = 200): void {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: status < 300,
    status,
    json: async () => body,
  });
}
