import { Router } from 'express';
import { CartController } from '../controllers/cartController.js';
import { optionalAuthenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalAuthenticate, CartController.getCart);
router.post('/items', optionalAuthenticate, CartController.addItem);
router.patch('/items/:variantSku', optionalAuthenticate, CartController.updateQuantity);
router.delete('/items/:variantSku', optionalAuthenticate, CartController.removeItem);
router.post('/coupon', optionalAuthenticate, CartController.applyCoupon);

export default router;
