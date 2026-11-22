'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Package,
  Calendar,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCartStore } from '../../stores/useCartStore';
import { IOrder } from '../../types';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist' | 'addresses'>('orders');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const res = await fetchApi('/orders');
        if (res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you wish to cancel this order?')) return;
    try {
      await fetchApi(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Cancelled by customer' }),
      });
      // Refresh orders
      const res = await fetchApi('/orders');
      if (res.data) setOrders(res.data);
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err: any) {
      alert(err.message || 'Unable to cancel order.');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        {/* Account Header */}
        <div className={styles.header}>
          <div className={styles.userMeta}>
            <div className={styles.avatarCircle}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1>{user.name}</h1>
              <p>{user.email} • {user.role === 'ADMIN' ? 'Administrator' : user.role === 'B2B_CUSTOMER' ? 'Trade Partner' : 'Connoisseur Member'}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className={styles.adminPortalBtn}>
                Admin Operations Console →
              </Link>
            )}
            <button onClick={logout} className={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className={styles.dashboardGrid}>
          {/* Navigation Sidebar */}
          <aside className={styles.navSidebar}>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${styles.navItem} ${activeTab === 'orders' ? styles.activeNavItem : ''}`}
            >
              <Package size={18} /> My Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`${styles.navItem} ${activeTab === 'wishlist' ? styles.activeNavItem : ''}`}
            >
              <Heart size={18} /> Saved Wishlist ({wishlistItems.length})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.activeNavItem : ''}`}
            >
              <User size={18} /> Profile & Account
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`${styles.navItem} ${activeTab === 'addresses' ? styles.activeNavItem : ''}`}
            >
              <MapPin size={18} /> Saved Addresses
            </button>
          </aside>

          {/* Main Display Pane */}
          <main className={styles.contentPane}>
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className={styles.tabSection}>
                <h2>Order History</h2>
                {isLoadingOrders ? (
                  <p>Retrieving your cellar orders...</p>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyBox}>
                    <Package size={36} className={styles.emptyIcon} />
                    <h3>No orders placed yet</h3>
                    <p>Discover our range of botanical beverage concentrates.</p>
                    <Link href="/shop" className={styles.shopBtn}>Explore Concentrates</Link>
                  </div>
                ) : (
                  <div className={styles.ordersList}>
                    {orders.map((o) => (
                      <div key={o._id} className={styles.orderCard}>
                        <div className={styles.orderCardHeader}>
                          <div>
                            <strong>Order #{o.orderNumber}</strong>
                            <span className={styles.orderDate}>
                              <Calendar size={12} /> {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          <div className={styles.statusGroup}>
                            <span className={`${styles.statusBadge} ${styles[o.status] || ''}`}>
                              {o.status}
                            </span>
                            <span className={`${styles.paymentBadge} ${styles[o.paymentStatus] || ''}`}>
                              Payment: {o.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className={styles.orderItemsPreview}>
                          {o.items.map((item, idx) => (
                            <div key={idx} className={styles.orderItemRow}>
                              <span>{item.productName} ({item.variantName}) × {item.quantity}</span>
                              <strong>₹{(item.totalPriceInPaise / 100).toFixed(0)}</strong>
                            </div>
                          ))}
                        </div>

                        <div className={styles.orderCardFooter}>
                          <div className={styles.totalBlock}>
                            <span>Total (Incl. Shipping & Taxes):</span>
                            <strong>₹{(o.totalAmountInPaise / 100).toFixed(0)}</strong>
                          </div>

                          <div className={styles.orderActions}>
                            {o.trackingNumber && (
                              <span className={styles.trackingInfo}>
                                Courier: {o.trackingCarrier || 'Delhivery'} #{o.trackingNumber}
                              </span>
                            )}
                            {o.status === 'PENDING' && (
                              <button
                                onClick={() => handleCancelOrder(o._id)}
                                className={styles.cancelBtn}
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className={styles.tabSection}>
                <h2>Saved Botanical Favorites</h2>
                {wishlistItems.length === 0 ? (
                  <div className={styles.emptyBox}>
                    <Heart size={36} className={styles.emptyIcon} />
                    <h3>Your wishlist is empty</h3>
                    <p>Save concentrates you want to explore or reorder later.</p>
                  </div>
                ) : (
                  <div className={styles.wishlistGrid}>
                    {wishlistItems.map((prod) => (
                      <div key={prod._id} className={styles.wishCard}>
                        <img src={prod.images[0]} alt={prod.name} className={styles.wishImg} />
                        <div className={styles.wishInfo}>
                          <h4>{prod.name}</h4>
                          <span className={styles.wishPrice}>
                            ₹{(prod.variants[0]?.priceInPaise / 100).toFixed(0)}
                          </span>
                          <div className={styles.wishActions}>
                            <button
                              onClick={() => addItem(prod._id, prod.variants[0]?.sku || '', 1)}
                              className={styles.addCartBtn}
                            >
                              <ShoppingBag size={14} /> Add to Basket
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod)}
                              className={styles.removeWishBtn}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className={styles.tabSection}>
                <h2>Account Profile</h2>
                <div className={styles.profileDetailsCard}>
                  <div className={styles.profileField}>
                    <span>Full Name</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div className={styles.profileField}>
                    <span>Email Address</span>
                    <strong>{user.email}</strong>
                  </div>
                  <div className={styles.profileField}>
                    <span>Phone</span>
                    <strong>{user.phone || 'Not provided'}</strong>
                  </div>
                  <div className={styles.profileField}>
                    <span>Account Privilege</span>
                    <strong>{user.role}</strong>
                  </div>
                  {user.companyName && (
                    <div className={styles.profileField}>
                      <span>Company / Establishment</span>
                      <strong>{user.companyName}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className={styles.tabSection}>
                <h2>Saved Delivery Addresses</h2>
                <div className={styles.addressCard}>
                  <h4>Default Shipping Address</h4>
                  <p>{user.name}</p>
                  <p>42 Marine Drive, Nariman Point</p>
                  <p>Mumbai, Maharashtra - 400021</p>
                  <p>Phone: {user.phone || '+91 9820012345'}</p>
                  <span className={styles.defaultPill}>Default Address</span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
