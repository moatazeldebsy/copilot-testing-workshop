import { Router } from 'express';
import { DiscountService } from '../services/discountService';

export function discountRouter(discountService: DiscountService): Router {
  const router = Router();

  router.post('/validate', (request, response) => {
    const { code } = request.body as { code?: string };
    discountService.validate(code ?? '');
    response.status(200).json({ data: { valid: true, code } });
  });

  router.post('/apply', (request, response) => {
    const { code, subtotal } = request.body as { code?: string; subtotal?: number };
    const result = discountService.apply(code ?? '', subtotal ?? 0);
    response.status(200).json({ data: result });
  });

  return router;
}
