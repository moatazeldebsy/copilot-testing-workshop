import fs from 'node:fs/promises';
import path from 'node:path';
import { type Order } from '../models/order';

export class OrderRepository {
  private readonly orders = new Map<string, Order>();
  private readonly dbPath = path.resolve(process.cwd(), 'data', 'orders.json');
  private hasLoaded = false;

  private async ensureLoaded(): Promise<void> {
    if (this.hasLoaded) return;

    try {
      const raw = await fs.readFile(this.dbPath, 'utf8');
      const parsed = JSON.parse(raw) as Order[];
      parsed.forEach((o) => {
        this.orders.set(o.id, { ...o, createdAt: new Date(o.createdAt) });
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    this.hasLoaded = true;
  }

  private async persist(): Promise<void> {
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    await fs.writeFile(this.dbPath, JSON.stringify(Array.from(this.orders.values()), null, 2), 'utf8');
  }

  async save(order: Order): Promise<Order> {
    await this.ensureLoaded();
    this.orders.set(order.id, order);
    await this.persist();
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    await this.ensureLoaded();
    return this.orders.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    await this.ensureLoaded();
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  async reset(): Promise<void> {
    this.orders.clear();
    this.hasLoaded = true;
    await fs.rm(this.dbPath, { force: true });
  }
}
