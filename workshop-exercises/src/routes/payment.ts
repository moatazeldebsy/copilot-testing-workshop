import { Router } from 'express';
import { type ChargeDto } from '../models/payment';
import { PaymentService } from '../services/paymentService';

export function paymentRouter(paymentService: PaymentService): Router {
  const router = Router();

  router.post('/charge', (request, response) => {
    const dto = request.body as ChargeDto;
    const intent = paymentService.charge(dto);
    response.status(201).json({ data: intent });
  });

  router.get('/:id', (request, response) => {
    const intent = paymentService.getIntent(request.params.id);
    response.status(200).json({ data: intent });
  });

  router.post('/:id/capture', (request, response) => {
    const intent = paymentService.capture(request.params.id);
    response.status(200).json({ data: intent });
  });

  router.post('/:id/refund', (request, response) => {
    const intent = paymentService.refund(request.params.id);
    response.status(200).json({ data: intent });
  });

  return router;
}
