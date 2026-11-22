import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Inventory } from '../models/Inventory.js';
import { B2BEnquiry } from '../models/B2BEnquiry.js';
import { OrderStatus, PaymentStatus } from '../types/index.js';

export class AdminService {
  static async getDashboardMetrics() {
    const [
      totalOrders,
      paidOrders,
      totalCustomers,
      lowStockCount,
      pendingB2BCount,
      recentOrders,
      recentEnquiries,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.find({ paymentStatus: PaymentStatus.PAID }),
      User.countDocuments({ role: 'CUSTOMER' }),
      Inventory.countDocuments({ $expr: { $lte: ['$availableStock', '$lowStockThreshold'] } }),
      B2BEnquiry.countDocuments({ status: 'NEW' }),
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
      B2BEnquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalRevenueInPaise = paidOrders.reduce((acc, curr) => acc + curr.totalAmountInPaise, 0);

    return {
      totalRevenueInPaise,
      totalOrders,
      totalCustomers,
      lowStockCount,
      pendingB2BCount,
      recentOrders,
      recentEnquiries,
    };
  }

  static async getAnalytics() {
    // 7-day revenue trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      paymentStatus: PaymentStatus.PAID,
    }).lean();

    const revenueByDate: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      revenueByDate[key] = 0;
    }

    orders.forEach((o) => {
      const dateKey = (o.createdAt as any).toISOString().split('T')[0];
      if (revenueByDate[dateKey] !== undefined) {
        revenueByDate[dateKey] += o.totalAmountInPaise;
      }
    });

    const bestSellers = await Product.find({ isPublished: true })
      .sort({ ratingAverage: -1 })
      .limit(5)
      .select('name slug variants ratingAverage')
      .lean();

    return {
      revenueByDate,
      bestSellers,
    };
  }

  static async getAllOrders(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    await order.save();
    return order;
  }

  static async getAllCustomers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      User.find().select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getInventoryList() {
    return Inventory.find()
      .populate('product', 'name slug images')
      .sort({ availableStock: 1 })
      .lean();
  }

  static async updateInventoryStock(variantSku: string, changeAmount: number, reason: string) {
    const inv = await Inventory.findOne({ variantSku });
    if (!inv) {
      throw new Error(`Inventory item for variant '${variantSku}' not found.`);
    }

    inv.availableStock = Math.max(0, inv.availableStock + changeAmount);
    inv.history.push({
      changeAmount,
      reason,
      timestamp: new Date(),
    });
    await inv.save();

    return inv;
  }
}
