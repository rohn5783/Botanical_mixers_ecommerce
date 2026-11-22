import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService.js';
import { paymentVerifySchema } from '../validators/index.js';
import { verifyRazorpayWebhookSignature } from '../integrations/razorpay.js';
import { Payment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { OrderStatus, PaymentStatus } from '../types/index.js';

export class PaymentController {
  static async createPaymentOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ success: false, message: 'Order ID is required.' });
        return;
      }

      const result = await PaymentService.createPaymentSession(orderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = paymentVerifySchema.parse(req.body);
      const result = await PaymentService.verifyPayment(validated);
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = JSON.stringify(req.body);

      // Verify webhook signature
      const isSignatureValid = verifyRazorpayWebhookSignature(rawBody, signature);
      if (!isSignatureValid) {
        res.status(400).json({ status: 'invalid_signature' });
        return;
      }

      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentEntity = req.body.payload.payment.entity;
        const rzpOrderId = paymentEntity.order_id;
        const rzpPaymentId = paymentEntity.id;

        const payment = await Payment.findOne({ razorpayOrderId: rzpOrderId });
        if (payment && payment.status !== PaymentStatus.PAID) {
          payment.status = PaymentStatus.PAID;
          payment.razorpayPaymentId = rzpPaymentId;
          payment.rawWebhookData = req.body;
          await payment.save();

          await Order.findByIdAndUpdate(payment.orderId, {
            paymentStatus: PaymentStatus.PAID,
            status: OrderStatus.CONFIRMED,
            razorpayPaymentId: rzpPaymentId,
          });
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('[Razorpay Webhook Error]:', error);
      res.status(500).json({ status: 'error' });
    }
  }
}
