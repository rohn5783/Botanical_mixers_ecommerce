import { Payment, IPayment } from '../models/Payment.js';
import { Order } from '../models/Order.js';
import { Inventory } from '../models/Inventory.js';
import {
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
} from '../integrations/razorpay.js';
import { sendTransactionalEmail } from '../integrations/resend.js';
import { OrderStatus, PaymentStatus } from '../types/index.js';

export class PaymentService {
  static async createPaymentSession(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error('Order has already been paid.');
    }

    const rzpOrder = await createRazorpayOrder({
      amountInPaise: order.totalAmountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
      },
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    await Payment.create({
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amountInPaise: order.totalAmountInPaise,
      currency: 'INR',
      status: PaymentStatus.PENDING,
    });

    return {
      razorpayOrderId: rzpOrder.id,
      amountInPaise: order.totalAmountInPaise,
      currency: 'INR',
      orderNumber: order.orderNumber,
    };
  }

  static async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    const isValid = verifyRazorpayPaymentSignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValid) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: data.razorpayOrderId },
        {
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          status: PaymentStatus.FAILED,
          failureReason: 'Cryptographic signature verification failed.',
        }
      );
      order.paymentStatus = PaymentStatus.FAILED;
      await order.save();
      throw new Error('Payment verification failed. Invalid gateway signature.');
    }

    // Payment is valid! Update payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: data.razorpayOrderId },
      {
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: PaymentStatus.PAID,
      }
    );

    // Update order status
    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.CONFIRMED;
    order.razorpayPaymentId = data.razorpayPaymentId;
    await order.save();

    // Deduct actual available stock and clear reserved stock
    for (const item of order.items) {
      await Inventory.findOneAndUpdate(
        { variantSku: item.variantSku },
        {
          $inc: { availableStock: -item.quantity, reservedStock: -item.quantity },
          $push: {
            history: {
              changeAmount: -item.quantity,
              reason: `Order confirmed deduction: ${order.orderNumber}`,
              timestamp: new Date(),
            },
          },
        }
      );
    }

    // Send confirmation email via Resend
    await sendTransactionalEmail({
      to: order.customerEmail,
      subject: `Order Confirmed: ${order.orderNumber} — Aranya Botanicals`,
      html: `
        <div style="font-family: serif; color: #1A2F23; padding: 24px;">
          <h2>Thank You for Ordering with Aranya Botanicals</h2>
          <p>Your order <strong>${order.orderNumber}</strong> has been confirmed and is being prepared for dispatch.</p>
          <p>Total Paid: ₹${(order.totalAmountInPaise / 100).toFixed(2)}</p>
          <p>We appreciate your celebration of pure Indian botanicals.</p>
        </div>
      `,
    });

    return {
      success: true,
      orderNumber: order.orderNumber,
      status: order.status,
    };
  }
}
