import crypto from 'node:crypto';
import { type Cart, type CartItem, type AddItemDto } from '../models/cart';

export class CartRepository {
  private readonly carts = new Map<string, Cart>();

  async findByUserId(userId: string): Promise<Cart> {
    return this.carts.get(userId) ?? { userId, items: [], subtotal: 0, updatedAt: new Date() };
  }

  async addItem(userId: string, dto: AddItemDto): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    const existing = cart.items.find((i) => i.productId === dto.productId);

    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      const item: CartItem = { id: crypto.randomUUID(), ...dto };
      cart.items.push(item);
    }

    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cart.updatedAt = new Date();
    this.carts.set(userId, cart);
    return cart;
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cart.updatedAt = new Date();
    this.carts.set(userId, cart);
    return cart;
  }

  async clear(userId: string): Promise<void> {
    this.carts.delete(userId);
  }

  reset(): void {
    this.carts.clear();
  }
}
