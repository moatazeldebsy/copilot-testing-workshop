import crypto from 'node:crypto';
import { ApiError } from '../errors/apiError';
import { type CreateUserDto, type PublicUser, type User } from '../models/user';
import { UserRepository } from '../repositories/userRepository';
import { issueToken } from './tokenService';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  private validateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Name is required');
    }

    if (name.trim().length < 2) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Name must be at least 2 characters');
    }
  }

  private validateEmail(email: string): string {
    const normalized = email.trim().toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    if (!validEmail) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Valid email is required');
    }

    return normalized;
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Password must be at least 8 characters');
    }
  }

  private hashPassword(password: string): string {
    return crypto.scryptSync(password, 'workshop-salt', 64).toString('hex');
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async createUser(dto: CreateUserDto): Promise<PublicUser> {
    this.validateName(dto.name);
    this.validatePassword(dto.password);
    const email = this.validateEmail(dto.email);

    const existing = await this.repo.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'DUPLICATE_EMAIL', 'Email already registered');
    }

    const user = await this.repo.save({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      email,
      passwordHash: this.hashPassword(dto.password),
      role: dto.role ?? 'viewer',
      createdAt: new Date(),
    });

    return this.toPublicUser(user);
  }

  async getUser(id: string): Promise<PublicUser> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    return this.toPublicUser({
      ...user,
      name: user.name
        .trim()
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' '),
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    await this.repo.delete(id);
  }

  async authenticate(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const user = await this.repo.findByEmail(normalizedEmail);
    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const providedPasswordHash = this.hashPassword(password);
    if (user.passwordHash !== providedPasswordHash) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    return {
      token: issueToken({ userId: user.id, email: user.email, role: user.role }),
      user: this.toPublicUser(user),
    };
  }
}