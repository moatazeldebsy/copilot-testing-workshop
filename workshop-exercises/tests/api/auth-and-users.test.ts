import request from 'supertest';
import { app, resetWorkshopData } from '../../src/app';

describe('Auth and user API', () => {
  beforeEach(async () => {
    await resetWorkshopData();
  });

  it('should register a user and return token with public profile', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Bob Builder',
        email: 'bob@example.com',
        password: 'supersecure123',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe('bob@example.com');
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  it('should reject requests to protected user route without bearer token', async () => {
    const response = await request(app).get('/api/users/some-id');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should login seeded admin and read protected user route with bearer token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'workshop-password' });

    expect(login.status).toBe(200);

    const token: string = login.body.data.token;
    const userId: string = login.body.data.user.id;

    const userResponse = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(userResponse.status).toBe(200);
    expect(userResponse.body.data.email).toBe('alice@example.com');
    expect(userResponse.body.data.passwordHash).toBeUndefined();
  });

  it('should reject duplicate registration with structured error payload', async () => {
    const first = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Nina',
        email: 'nina@example.com',
        password: 'supersecure123',
        role: 'viewer',
      });

    expect(first.status).toBe(201);

    const second = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Nina Clone',
        email: 'nina@example.com',
        password: 'supersecure123',
        role: 'viewer',
      });

    expect(second.status).toBe(409);
    expect(second.body.error.code).toBe('DUPLICATE_EMAIL');
    expect(second.body.error.message).toBe('Email already registered');
  });
});
