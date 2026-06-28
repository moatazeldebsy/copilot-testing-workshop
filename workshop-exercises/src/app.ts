import express from 'express';
import { ApiError } from './errors/apiError';
import { openApiSpec } from './openapi';
import { CartRepository } from './repositories/cartRepository';
import { DiscountRepository } from './repositories/discountRepository';
import { OrderRepository } from './repositories/orderRepository';
import { PaymentRepository } from './repositories/paymentRepository';
import { UserRepository } from './repositories/userRepository';
import { authRouter } from './routes/auth';
import { cartRouter } from './routes/cart';
import { discountRouter } from './routes/discount';
import { fraudRouter } from './routes/fraud';
import { notificationRouter } from './routes/notification';
import { paymentRouter } from './routes/payment';
import { CartService } from './services/cartService';
import { DiscountService } from './services/discountService';
import { FraudService } from './services/fraudService';
import { NotificationService } from './services/notificationService';
import { PaymentService } from './services/paymentService';
import { UserService } from './services/userService';
import { verifyToken } from './services/tokenService';

// Repositories
export const userRepository = new UserRepository();
export const cartRepository = new CartRepository();
export const discountRepository = new DiscountRepository();
export const paymentRepository = new PaymentRepository();
export const orderRepository = new OrderRepository();

// Services
export const userService = new UserService(userRepository);
export const cartService = new CartService(cartRepository);
export const discountService = new DiscountService(discountRepository);
export const fraudService = new FraudService();
export const paymentService = new PaymentService(paymentRepository);
export const notificationService = new NotificationService();

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
  cartRepository.reset();
  discountRepository.reset();
  paymentRepository.reset();
  notificationService.reset();
  await orderRepository.reset();
  await ensureSeedUser();
}

void ensureSeedUser();

export const app = express();

app.use(express.json());

app.get('/', (_request, response) => {
  response.redirect(301, '/docs');
});

app.get('/api/openapi.json', (_request, response) => {
  response.status(200).json(openApiSpec);
});

app.get('/docs', (_request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Workshop Checkout API — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; }
    .swagger-ui .topbar { background: #7c3aed; }
    .swagger-ui .topbar a span { color: #fff; }
    .swagger-ui .info .title { color: #7c3aed; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
    });
  </script>
</body>
</html>`);
});

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    data: {
      status: 'ok',
      services: ['user', 'cart', 'discount', 'fraud', 'payment', 'notification'],
    },
  });
});

// Auth middleware — public paths bypass token check
const PUBLIC_POST_PATHS = ['/health', '/auth/login', '/auth/register', '/users'];

app.use('/api', (request, _response, next) => {
  if (request.method === 'POST' && PUBLIC_POST_PATHS.includes(request.path)) {
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

// User routes (kept inline for backward compat with existing tests)
app.post('/api/users', async (request, response) => {
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
  response.status(201).json({ data: user });
});

app.get('/api/users/:id', async (request, response) => {
  const user = await userService.getUser(request.params.id);
  response.status(200).json({ data: user });
});

app.delete('/api/users/:id', async (request, response) => {
  await userService.deleteUser(request.params.id);
  response.status(204).send();
});

// Checkout pipeline routes
app.use('/api/auth', authRouter(userService));
app.use('/api/cart', cartRouter(cartService));
app.use('/api/discount', discountRouter(discountService));
app.use('/api/fraud', fraudRouter(fraudService));
app.use('/api/payment', paymentRouter(paymentService));
app.use('/api/notifications', notificationRouter(notificationService));

// Global error handler
app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message },
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
