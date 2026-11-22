import { Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import { checkoutSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = checkoutSchema.parse(req.body);
      const guestToken = (req.headers['x-guest-token'] as string) || validated.guestToken;

      const order = await OrderService.createOrderFromCart({
        userId: req.user?.userId,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        shippingAddress: validated.shippingAddress,
        cartId: validated.cartId,
        guestToken,
        couponCode: validated.couponCode,
        customerNotes: validated.customerNotes,
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const order = await OrderService.getOrderById(id, req.user?.userId);
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const orders = await OrderService.getUserOrders(req.user.userId);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const { reason } = req.body;
      const order = await OrderService.cancelOrder(id, req.user?.userId, reason);
      res.status(200).json({ success: true, message: 'Order cancelled.', data: order });
    } catch (error) {
      next(error);
    }
  }
}
