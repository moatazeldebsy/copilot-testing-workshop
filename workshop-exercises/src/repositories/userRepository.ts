import fs from 'node:fs/promises';
import path from 'node:path';
import { type User } from '../models/user';

export class UserRepository {
  private readonly users = new Map<string, User>();
  private readonly dbPath = path.resolve(process.cwd(), 'data', 'users.json');
  private hasLoaded = false;

  private deserializeUser(raw: User): User {
    return {
      ...raw,
      createdAt: new Date(raw.createdAt),
    };
  }

  private async ensureLoaded(): Promise<void> {
    if (this.hasLoaded) {
      return;
    }

    try {
      const raw = await fs.readFile(this.dbPath, 'utf8');
      const parsed = JSON.parse(raw) as User[];
      parsed.forEach((user) => {
        const hydrated = this.deserializeUser(user);
        this.users.set(hydrated.id, hydrated);
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    this.hasLoaded = true;
  }

  private async persist(): Promise<void> {
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    await fs.writeFile(this.dbPath, JSON.stringify(Array.from(this.users.values()), null, 2), 'utf8');
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.ensureLoaded();

    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }

    return null;
  }

  async findById(id: string): Promise<User | null> {
    await this.ensureLoaded();
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<User> {
    await this.ensureLoaded();
    this.users.set(user.id, user);
    await this.persist();
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.ensureLoaded();
    this.users.delete(id);
    await this.persist();
  }

  async list(): Promise<User[]> {
    await this.ensureLoaded();
    return Array.from(this.users.values());
  }

  async reset(): Promise<void> {
    this.users.clear();
    this.hasLoaded = true;
    await fs.rm(this.dbPath, { force: true });
  }
}