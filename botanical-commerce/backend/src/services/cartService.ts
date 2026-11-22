import { Cart, ICart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import mongoose from 'mongoose';

export class CartService {
  static async getOrCreateCart(userId?: string, guestToken?: string): Promise<ICart> {
    let cart: ICart | null = null;

    if (userId) {
      cart = await Cart.findOne({ userId }).populate('items.product');
      // If user logs in and had a guest cart, merge it
      if (guestToken) {
        const guestCart = await Cart.findOne({ guestToken });
        if (guestCart && guestCart.items.length > 0) {
          if (!cart) {
            guestCart.userId = new mongoose.Types.ObjectId(userId) as any;
            guestCart.guestToken = undefined;
            await guestCart.save();
            return guestCart.populate('items.product');
          } else {
            for (const gItem of guestCart.items) {
              const existing = cart.items.find((i) => i.variantSku === gItem.variantSku);
              if (existing) {
                existing.quantity += gItem.quantity;
              } else {
                cart.items.push(gItem);
              }
            }
            await Cart.findByIdAndDelete(guestCart._id);
          }
        }
      }
    } else if (guestToken) {
      cart = await Cart.findOne({ guestToken }).populate('items.product');
    }

    if (!cart) {
      cart = await Cart.create({
        userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        guestToken: userId ? undefined : (guestToken || new mongoose.Types.ObjectId().toString()),
        items: [],
        subtotalInPaise: 0,
        discountInPaise: 0,
        totalAmountInPaise: 0,
      });
    }

    return this.recalculateCart(cart);
  }

  static async addItem(params: {
    userId?: string;
    guestToken?: string;
    productId: string;
    variantSku: string;
    quantity: number;
  }) {
    const product = await Product.findById(params.productId);
    if (!product || !product.isPublished) {
      throw new Error('Product not found or currently unavailable.');
    }

    const variant = product.variants.find((v) => v.sku === params.variantSku);
    if (!variant) {
      throw new Error(`Variant '${params.variantSku}' not found for product.`);
    }

    const cart = await this.getOrCreateCart(params.userId, params.guestToken);

    const existingIndex = cart.items.findIndex((item) => item.variantSku === params.variantSku);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += params.quantity;
    } else {
      cart.items.push({
        product: product._id as any,
        variantSku: variant.sku,
        variantName: variant.name,
        volumeMl: variant.volumeMl,
        quantity: params.quantity,
        priceInPaise: variant.priceInPaise,
      });
    }

    return this.recalculateCart(cart);
  }

  static async updateItemQuantity(params: {
    userId?: string;
    guestToken?: string;
    variantSku: string;
    quantity: number;
  }) {
    const cart = await this.getOrCreateCart(params.userId, params.guestToken);
    const itemIndex = cart.items.findIndex((i) => i.variantSku === params.variantSku);

    if (itemIndex === -1) {
      throw new Error('Item not found in shopping cart.');
    }

    if (params.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = params.quantity;
    }

    return this.recalculateCart(cart);
  }

  static async removeItem(params: {
    userId?: string;
    guestToken?: string;
    variantSku: string;
  }) {
    const cart = await this.getOrCreateCart(params.userId, params.guestToken);
    cart.items = cart.items.filter((i) => i.variantSku !== params.variantSku);
    return this.recalculateCart(cart);
  }

  static async applyCoupon(params: {
    userId?: string;
    guestToken?: string;
    couponCode: string;
  }) {
    const cart = await this.getOrCreateCart(params.userId, params.guestToken);
    const code = params.couponCode.trim().toUpperCase();

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      throw new Error(`Invalid or expired coupon code: ${code}`);
    }

    if (coupon.minOrderValueInPaise > 0 && cart.subtotalInPaise < coupon.minOrderValueInPaise) {
      throw new Error(
        `Coupon requires a minimum order value of ₹${(coupon.minOrderValueInPaise / 100).toFixed(0)}`
      );
    }

    cart.couponCode = coupon.code;
    return this.recalculateCart(cart);
  }

  static async clearCart(cartId: string) {
    await Cart.findByIdAndUpdate(cartId, {
      items: [],
      couponCode: undefined,
      discountInPaise: 0,
      subtotalInPaise: 0,
      totalAmountInPaise: 0,
    });
  }

  private static async recalculateCart(cart: ICart): Promise<ICart> {
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.priceInPaise * item.quantity;
    }
    cart.subtotalInPaise = subtotal;

    let discount = 0;
    if (cart.couponCode) {
      const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
      if (coupon) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountInPaise && discount > coupon.maxDiscountInPaise) {
            discount = coupon.maxDiscountInPaise;
          }
        } else {
          discount = coupon.discountValue;
        }
      } else {
        cart.couponCode = undefined;
      }
    }

    cart.discountInPaise = Math.min(discount, subtotal);
    cart.totalAmountInPaise = Math.max(0, subtotal - cart.discountInPaise);

    await cart.save();
    return Cart.findById(cart._id).populate('items.product') as Promise<ICart>;
  }
}
