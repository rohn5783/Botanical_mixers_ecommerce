'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import styles from './page.module.scss';

const FREE_SHIPPING_THRESHOLD_PAISE = 99900;

export default function CartPage() {
  const { cart, updateQuantity, removeItem, applyCoupon, isLoading } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInPaise || 0;
  const discount = cart?.discountInPaise || 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : (items.length > 0 ? 8000 : 0);
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      setCouponMsg(null);
      await applyCoupon(couponCode);
      setCouponMsg({ text: `Coupon '${couponCode.toUpperCase()}' applied successfully!`, isError: false });
      setCouponCode('');
    } catch (err: any) {
      setCouponMsg({ text: err.message || 'Failed to apply coupon', isError: true });
    }
  };

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/shop" className={styles.backLink}>
            <ArrowLeft size={16} /> Continue Exploring
          </Link>
          <h1>Your Botanical Basket</h1>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'} in your cellar</p>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <h2>Your basket is empty</h2>
            <p>You haven't selected any artisanal botanical concentrates yet.</p>
            <Link href="/shop" className={styles.exploreBtn}>
              Browse All Concentrates
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Items Table */}
            <div className={styles.itemsTableWrapper}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Format</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              <div className={styles.tableBody}>
                {items.map((item) => (
                  <div key={item.variantSku} className={styles.itemRow}>
                    <div className={styles.productCell}>
                      <img
                        src={item.product?.images?.[0] || '/images/products/kokum-bottle-main.jpg'}
                        alt={item.product?.name || item.variantName}
                        className={styles.productImg}
                      />
                      <div className={styles.prodMeta}>
                        <Link href={`/products/${item.product?.slug || ''}`} className={styles.title}>
                          {item.product?.name || item.variantName}
                        </Link>
                        <span className={styles.sku}>SKU: {item.variantSku}</span>
                      </div>
                    </div>

                    <div className={styles.formatCell}>
                      <span>{item.volumeMl}ml</span>
                    </div>

                    <div className={styles.priceCell}>
                      <span>₹{(item.priceInPaise / 100).toFixed(0)}</span>
                    </div>

                    <div className={styles.qtyCell}>
                      <div className={styles.qtyControls}>
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                          className={styles.qtyBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyVal}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                          className={styles.qtyBtn}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.totalCell}>
                      <span>₹{((item.priceInPaise * item.quantity) / 100).toFixed(0)}</span>
                    </div>

                    <div className={styles.actionCell}>
                      <button
                        onClick={() => removeItem(item.variantSku)}
                        className={styles.deleteBtn}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Checkout Card */}
            <div className={styles.summarySidebar}>
              <div className={styles.summaryCard}>
                <h3>Order Summary</h3>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <div className={styles.couponInputWrapper}>
                    <Tag size={16} className={styles.tagIcon} />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className={styles.applyBtn}>
                    Apply
                  </button>
                </form>
                {couponMsg && (
                  <p className={couponMsg.isError ? styles.errorMsg : styles.successMsg}>
                    {couponMsg.text}
                  </p>
                )}

                <div className={styles.summaryLines}>
                  <div className={styles.summaryLine}>
                    <span>Subtotal</span>
                    <span>₹{(subtotal / 100).toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                      <span>Discount ({cart?.couponCode})</span>
                      <span>-₹{(discount / 100).toFixed(0)}</span>
                    </div>
                  )}
                  <div className={styles.summaryLine}>
                    <span>Pan-India Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : '₹80'}</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>Estimated 12% GST</span>
                    <span>Included</span>
                  </div>
                  <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                    <span>Total Amount</span>
                    <span>₹{(total / 100).toFixed(0)}</span>
                  </div>
                </div>

                <Link href="/checkout" className={styles.checkoutBtn}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <div className={styles.trustBadges}>
                  <ShieldCheck size={16} />
                  <span>Encrypted 256-bit Razorpay Checkout • Express Pan-India Courier</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
