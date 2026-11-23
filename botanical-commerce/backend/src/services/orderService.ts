import { Order, IOrder, IShippingAddress } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Inventory } from '../models/Inventory.js';
import { User } from '../models/User.js';
import { CartService } from './cartService.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { APP_CONSTANTS } from '../constants/index.js';
import { OrderStatus, PaymentStatus } from '../types/index.js';
import mongoose from 'mongoose';

export class OrderService {
  static async createOrderFromCart(params: {
    userId?: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: IShippingAddress;
    cartId?: string;
    guestToken?: string;
    couponCode?: string;
    customerNotes?: string;
  }): Promise<IOrder> {
    const cart = await CartService.getOrCreateCart(params.userId, params.guestToken);

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Your shopping cart is empty.');
    }

    const orderItems: any[] = [];
    let subtotalInPaise = 0;

    // Validate inventory & calculate order items
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product referenced in cart no longer exists.`);
      }

      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (!variant) {
        throw new Error(`Variant '${item.variantSku}' unavailable.`);
      }

      const inv = await Inventory.findOne({ variantSku: item.variantSku });
      if (inv && inv.availableStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name} (${variant.name}). Only ${inv.availableStock} remaining.`);
      }

      const lineTotal = variant.priceInPaise * item.quantity;
      subtotalInPaise += lineTotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        variantSku: variant.sku,
        variantName: variant.name,
        volumeMl: variant.volumeMl,
        unitPriceInPaise: variant.priceInPaise,
        quantity: item.quantity,
        totalPriceInPaise: lineTotal,
        image: product.images[0] || '/images/products/placeholder-botanical.png',
      });
    }

    // Shipping calculation
    const shippingFeeInPaise =
      subtotalInPaise >= APP_CONSTANTS.FREE_SHIPPING_THRESHOLD_PAISE
        ? 0
        : APP_CONSTANTS.STANDARD_SHIPPING_FEE_PAISE;

    // Discount from cart
    const discountInPaise = cart.discountInPaise || 0;

    // 12% GST included or calculated
    const taxableAmount = Math.max(0, subtotalInPaise - discountInPaise);
    const taxInPaise = Math.round((taxableAmount * APP_CONSTANTS.GST_RATE_PERCENTAGE) / 100);

    const totalAmountInPaise = taxableAmount + shippingFeeInPaise;

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: params.userId ? new mongoose.Types.ObjectId(params.userId) : undefined,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      shippingAddress: params.shippingAddress,
      items: orderItems,
      subtotalInPaise,
      taxInPaise,
      shippingFeeInPaise,
      discountInPaise,
      couponCode: cart.couponCode,
      totalAmountInPaise,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: 'RAZORPAY',
      customerNotes: params.customerNotes,
    });

    // Reserve inventory
    for (const item of orderItems) {
      await Inventory.findOneAndUpdate(
        { variantSku: item.variantSku },
        {
          $inc: { reservedStock: item.quantity },
          $push: {
            history: {
              changeAmount: -item.quantity,
              reason: `Order reserved: ${orderNumber}`,
              timestamp: new Date(),
            },
          },
        }
      );
    }

    // Clear cart
    await CartService.clearCart(cart._id.toString());

    return order;
  }

  static async getOrderById(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }
    const order = await Order.findOne(query).populate('items.product').lean();
    if (!order) {
      throw new Error('Order not found.');
    }
    return order;
  }

  static async getUserOrders(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    }
    return Order.find({
      $or: [{ user: userId }, { customerEmail: user.email.toLowerCase() }],
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async cancelOrder(orderId: string, userId?: string, reason?: string) {
    const query: any = { _id: orderId };
    if (userId) {
      query.user = userId;
    }

    const order = await Order.findOne(query);
    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel an order that is already in transit or delivered.');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelReason = reason || 'Cancelled by customer';
    await order.save();

    // Release reserved inventory
    for (const item of order.items) {
      await Inventory.findOneAndUpdate(
        { variantSku: item.variantSku },
        {
          $inc: { reservedStock: -item.quantity },
          $push: {
            history: {
              changeAmount: item.quantity,
              reason: `Order cancelled release: ${order.orderNumber}`,
              timestamp: new Date(),
            },
          },
        }
      );
    }

    return order;
  }
}
