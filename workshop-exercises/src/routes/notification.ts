import { Router } from 'express';
import { type NotificationPayload } from '../models/notification';
import { NotificationService } from '../services/notificationService';

export function notificationRouter(notificationService: NotificationService): Router {
  const router = Router();

  router.post('/receipt', (request, response) => {
    const payload = request.body as NotificationPayload;
    const log = notificationService.send({ ...payload, type: 'receipt' });
    response.status(201).json({ data: log });
  });

  router.get('/:userId', (request, response) => {
    const logs = notificationService.getLogsForUser(request.params.userId);
    response.status(200).json({ data: logs });
  });

  return router;
}
