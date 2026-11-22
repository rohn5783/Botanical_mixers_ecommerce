import { Response, NextFunction } from 'express';
import { CartService } from '../services/cartService.js';
import { cartItemSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const guestToken = req.headers['x-guest-token'] as string;
      const cart = await CartService.getOrCreateCart(req.user?.userId, guestToken);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = cartItemSchema.parse(req.body);
      const guestToken = (req.headers['x-guest-token'] as string) || validated.guestToken;

      const cart = await CartService.addItem({
        userId: req.user?.userId,
        guestToken,
        productId: validated.productId,
        variantSku: validated.variantSku,
        quantity: validated.quantity,
      });

      res.status(200).json({ success: true, message: 'Item added to cart.', data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const variantSku = (Array.isArray(req.params.variantSku) ? req.params.variantSku[0] : req.params.variantSku) as string;
      const { quantity } = req.body;
      const guestToken = req.headers['x-guest-token'] as string;

      const cart = await CartService.updateItemQuantity({
        userId: req.user?.userId,
        guestToken,
        variantSku,
        quantity: parseInt(quantity, 10),
      });

      res.status(200).json({ success: true, message: 'Cart updated.', data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const variantSku = (Array.isArray(req.params.variantSku) ? req.params.variantSku[0] : req.params.variantSku) as string;
      const guestToken = req.headers['x-guest-token'] as string;

      const cart = await CartService.removeItem({
        userId: req.user?.userId,
        guestToken,
        variantSku,
      });

      res.status(200).json({ success: true, message: 'Item removed from cart.', data: cart });
    } catch (error) {
      next(error);
    }
  }

  static async applyCoupon(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ success: false, message: 'Coupon code required.' });
        return;
      }
      const guestToken = req.headers['x-guest-token'] as string;

      const cart = await CartService.applyCoupon({
        userId: req.user?.userId,
        guestToken,
        couponCode: code,
      });

      res.status(200).json({ success: true, message: `Coupon '${code}' applied!`, data: cart });
    } catch (error) {
      next(error);
    }
  }
}
