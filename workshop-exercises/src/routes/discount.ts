import { NextFunction, Request, Response, Router } from 'express';
import { DiscountService } from '../services/discountService';

export function discountRouter(discountService: DiscountService): Router {
  const router = Router();

  router.post('/validate', (request: Request, response: Response, next: NextFunction) => {
    try {
      const { code } = request.body as { code?: string };
      discountService.validate(code ?? '');
      response.status(200).json({ data: { valid: true, code } });
    } catch (err) {
      next(err);
    }
  });

  router.post('/apply', (request: Request, response: Response, next: NextFunction) => {
    try {
      const { code, subtotal } = request.body as { code?: string; subtotal?: number };
      const result = discountService.apply(code ?? '', subtotal ?? 0);
      response.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
