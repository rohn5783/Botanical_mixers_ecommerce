import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { optionalAuthenticate, authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/', optionalAuthenticate, OrderController.createOrder);
router.get('/', authenticate, OrderController.getUserOrders);
router.get('/:id', optionalAuthenticate, OrderController.getOrderById);
router.patch('/:id/cancel', optionalAuthenticate, OrderController.cancelOrder);

export default router;
