'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import styles from './CartDrawer.module.scss';

const FREE_SHIPPING_THRESHOLD_PAISE = 99900;

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, applyCoupon, isLoading } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotalInPaise || 0;
  const discount = cart?.discountInPaise || 0;
  const total = cart?.totalAmountInPaise || 0;

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_PAISE) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    try {
      setCouponError('');
      await applyCoupon(couponInput);
      setCouponSuccess(`Coupon applied!`);
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    }
  };

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h3>Your Botanical Basket</h3>
            <span className={styles.itemCount}>({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className={styles.shippingBarContainer}>
          {amountNeededForFreeShipping > 0 ? (
            <p className={styles.shippingNotice}>
              Add <strong>₹{(amountNeededForFreeShipping / 100).toFixed(0)}</strong> more for <strong>Free Express Shipping</strong>
            </p>
          ) : (
            <p className={`${styles.shippingNotice} ${styles.freeUnlocked}`}>
              🎉 You have unlocked <strong>Free Pan-India Delivery!</strong>
            </p>
          )}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Item List */}
        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Your botanical cellar is empty</p>
              <p className={styles.emptyDesc}>Discover our cold-crafted regional botanical concentrates.</p>
              <Link href="/shop" onClick={closeCart} className={styles.shopNowBtn}>
                Explore Concentrates
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantSku} className={styles.itemCard}>
                <div className={styles.itemImageWrapper}>
                  <img
                    src={item.product?.images?.[0] || '/images/products/kokum-bottle-main.jpg'}
                    alt={item.product?.name || item.variantName}
                    className={styles.itemImage}
                  />
                </div>
                <div className={styles.itemInfo}>
                  <Link
                    href={`/products/${item.product?.slug || ''}`}
                    onClick={closeCart}
                    className={styles.itemName}
                  >
                    {item.product?.name || item.variantName}
                  </Link>
                  <span className={styles.itemVariant}>
                    {item.variantName} ({item.volumeMl}ml)
                  </span>
                  <div className={styles.itemPriceRow}>
                    <span className={styles.itemPrice}>₹{(item.priceInPaise / 100).toFixed(0)}</span>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.variantSku)}
                  className={styles.removeBtn}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className={styles.drawerFooter}>
            {/* Coupon Section */}
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <div className={styles.couponInputWrapper}>
                <Tag size={16} className={styles.couponIcon} />
                <input
                  type="text"
                  placeholder="Coupon code (e.g. BOTANICAL10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className={styles.couponInput}
                />
              </div>
              <button type="submit" disabled={isLoading} className={styles.applyCouponBtn}>
                Apply
              </button>
            </form>
            {couponError && <p className={styles.couponErrorText}>{couponError}</p>}
            {couponSuccess && <p className={styles.couponSuccessText}>{couponSuccess}</p>}
            {cart?.couponCode && (
              <p className={styles.appliedCode}>
                Applied Coupon: <strong>{cart.couponCode}</strong> (-₹{(discount / 100).toFixed(0)})
              </p>
            )}

            {/* Price Breakdown */}
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{(subtotal / 100).toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>Botanical Discount</span>
                  <span>-₹{(discount / 100).toFixed(0)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Pan-India Shipping</span>
                <span>{amountNeededForFreeShipping === 0 ? 'FREE' : '₹80'}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Estimated Total (Incl. GST)</span>
                <span>₹{((total + (amountNeededForFreeShipping === 0 ? 0 : 8000)) / 100).toFixed(0)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link href="/checkout" onClick={closeCart} className={styles.checkoutBtn}>
              Proceed to Secure Checkout
              <ArrowRight size={18} />
            </Link>

            <div className={styles.trustBadges}>
              <ShieldCheck size={14} />
              <span>Encrypted Razorpay Checkout • 100% Genuine Extracts</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
