import express from 'express';
import { ApiError } from './errors/apiError';
import { UserRepository } from './repositories/userRepository';
import { verifyToken } from './services/tokenService';
import { UserService } from './services/userService';

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);

async function ensureSeedUser(): Promise<void> {
  try {
    await userService.createUser({
      name: 'Workshop Admin',
      email: 'alice@example.com',
      password: 'workshop-password',
      role: 'admin',
    });
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== 'DUPLICATE_EMAIL') {
      throw error;
    }
  }
}

export async function resetWorkshopData(): Promise<void> {
  await userRepository.reset();
  await ensureSeedUser();
}

void ensureSeedUser();

export const app = express();

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ data: { status: 'ok' } });
});

app.use('/api', (request, _response, next) => {
  const publicPaths = ['/health', '/auth/login', '/auth/register', '/users'];
  if (request.method === 'POST' && publicPaths.includes(request.path)) {
    next();
    return;
  }

  if (request.method === 'GET' && request.path === '/health') {
    next();
    return;
  }

  const header = request.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Missing bearer token'));
    return;
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const payload = verifyToken(token);
    (request as express.Request & { auth?: { userId: string } }).auth = { userId: payload.userId };
    next();
  } catch {
    next(new ApiError(401, 'UNAUTHORIZED', 'Invalid token'));
  }
});

app.post('/api/users', async (request, response) => {
  const { name, email, password, role } = request.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'viewer' | 'user';
  };

  try {
    const user = await userService.createUser({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
      role,
    });
    response.status(201).json({ data: user });
  } catch (error) {
    throw error;
  }
});

app.post('/api/auth/register', async (request, response) => {
  const { name, email, password, role } = request.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'viewer' | 'user';
  };

  const user = await userService.createUser({
    name: name ?? '',
    email: email ?? '',
    password: password ?? '',
    role,
  });

  const auth = await userService.authenticate(email ?? '', password ?? '');
  response.status(201).json({
    data: {
      user,
      token: auth.token,
    },
  });
});

app.get('/api/users/:id', async (request, response) => {
  const user = await userService.getUser(request.params.id);
  response.status(200).json({ data: user });
});

app.delete('/api/users/:id', async (request, response) => {
  await userService.deleteUser(request.params.id);
  response.status(204).send();
});

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body as { email?: string; password?: string };

  const result = await userService.authenticate(email ?? '', password ?? '');
  response.status(200).json({ data: result });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unexpected server error',
    },
  });
});