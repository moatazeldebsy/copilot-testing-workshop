import { NextFunction, Request, Response, Router } from 'express';
import { type ChargeDto } from '../models/payment';
import { PaymentService } from '../services/paymentService';

export function paymentRouter(paymentService: PaymentService): Router {
  const router = Router();

  router.post('/charge', (request: Request, response: Response, next: NextFunction) => {
    try {
      const dto = request.body as ChargeDto;
      const intent = paymentService.charge(dto);
      response.status(201).json({ data: intent });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
    try {
      const intent = paymentService.getIntent(request.params.id);
      response.status(200).json({ data: intent });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:id/capture', (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
    try {
      const intent = paymentService.capture(request.params.id);
      response.status(200).json({ data: intent });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:id/refund', (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
    try {
      const intent = paymentService.refund(request.params.id);
      response.status(200).json({ data: intent });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
