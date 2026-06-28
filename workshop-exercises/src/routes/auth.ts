import { Router } from 'express';
import { UserService } from '../services/userService';

export function authRouter(userService: UserService): Router {
  const router = Router();

  router.post('/register', async (request, response) => {
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
    response.status(201).json({ data: { user, token: auth.token } });
  });

  router.post('/login', async (request, response) => {
    const { email, password } = request.body as { email?: string; password?: string };
    const result = await userService.authenticate(email ?? '', password ?? '');
    response.status(200).json({ data: result });
  });

  return router;
}
