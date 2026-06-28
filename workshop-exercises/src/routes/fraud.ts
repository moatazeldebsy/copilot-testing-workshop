import { Router } from 'express';
import { type FraudCheckRequest } from '../models/fraud';
import { FraudService } from '../services/fraudService';

export function fraudRouter(fraudService: FraudService): Router {
  const router = Router();

  router.post('/check', (request, response) => {
    const body = request.body as FraudCheckRequest;
    const result = fraudService.check(body);
    response.status(200).json({ data: result });
  });

  return router;
}
