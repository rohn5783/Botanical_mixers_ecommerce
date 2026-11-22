import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', PaymentController.createPaymentOrder);
router.post('/verify', PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);

export default router;
