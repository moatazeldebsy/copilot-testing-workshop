import { ApiError } from '../errors/apiError';
import { type Cart, type AddItemDto } from '../models/cart';
import { CartRepository } from '../repositories/cartRepository';

export class CartService {
  constructor(private readonly repo: CartRepository) {}

  async getCart(userId: string): Promise<Cart> {
    return this.repo.findByUserId(userId);
  }

  async addItem(userId: string, dto: AddItemDto): Promise<Cart> {
    if (!dto.productId || !dto.name) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'productId and name are required');
    }

    if (typeof dto.price !== 'number' || dto.price < 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'price must be a non-negative number');
    }

    const quantity = dto.quantity ?? 1;
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'quantity must be a positive integer');
    }

    return this.repo.addItem(userId, { ...dto, quantity });
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.repo.findByUserId(userId);
    const exists = cart.items.some((i) => i.id === itemId);

    if (!exists) {
      throw new ApiError(404, 'ITEM_NOT_FOUND', 'Cart item not found');
    }

    return this.repo.removeItem(userId, itemId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.repo.clear(userId);
  }
}
