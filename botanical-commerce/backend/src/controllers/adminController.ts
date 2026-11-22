import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService.js';
import { OrderStatus } from '../types/index.js';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AdminService.getAnalytics();
      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const status = req.query.status as string;

      const result = await AdminService.getAllOrders(page, limit, status);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const { status, trackingNumber } = req.body;
      const order = await AdminService.updateOrderStatus(id, status as OrderStatus, trackingNumber);
      res.status(200).json({ success: true, message: 'Order status updated.', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await AdminService.getAllCustomers(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await AdminService.getInventoryList();
      res.status(200).json({ success: true, data: inventory });
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { variantSku, changeAmount, reason } = req.body;
      const updated = await AdminService.updateInventoryStock(
        variantSku,
        parseInt(changeAmount, 10),
        reason || 'Manual inventory adjustment'
      );
      res.status(200).json({ success: true, message: 'Inventory adjusted.', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
