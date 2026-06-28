import { Router } from 'express';
import { type AddItemDto } from '../models/cart';
import { CartService } from '../services/cartService';

export function cartRouter(cartService: CartService): Router {
  const router = Router();

  router.get('/:userId', async (request, response) => {
    const cart = await cartService.getCart(request.params.userId);
    response.status(200).json({ data: cart });
  });

  router.post('/:userId/items', async (request, response) => {
    const dto = request.body as AddItemDto;
    const cart = await cartService.addItem(request.params.userId, dto);
    response.status(201).json({ data: cart });
  });

  router.delete('/:userId/items/:itemId', async (request, response) => {
    const cart = await cartService.removeItem(request.params.userId, request.params.itemId);
    response.status(200).json({ data: cart });
  });

  router.delete('/:userId', async (request, response) => {
    await cartService.clearCart(request.params.userId);
    response.status(204).send();
  });

  return router;
}
