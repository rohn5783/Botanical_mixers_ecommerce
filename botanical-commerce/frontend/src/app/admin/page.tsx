'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Building2,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  FileText,
  TrendingUp,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { fetchApi } from '../../lib/api';
import styles from './page.module.scss';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'b2b'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [b2bEnquiries, setB2BEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status Update state for Orders
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('CONFIRMED');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  // Stock update modal state
  const [stockEditSku, setStockEditSku] = useState<string | null>(null);
  const [stockChangeVal, setStockChangeVal] = useState<number>(20);
  const [stockReason, setStockReason] = useState<string>('Batch replenishment');

  useEffect(() => {
    checkAuth();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [mRes, pRes, oRes, iRes, bRes] = await Promise.all([
        fetchApi('/admin/dashboard'),
        fetchApi('/products?limit=50'),
        fetchApi('/admin/orders'),
        fetchApi('/admin/inventory'),
        fetchApi('/b2b/enquiries'),
      ]);

      setMetrics(mRes.data || null);
      setProducts(pRes.products || []);
      setOrders(oRes.orders || []);
      setInventory(iRes.data || []);
      setB2BEnquiries(bRes.data || []);
    } catch (err: any) {
      console.error('[Admin] Error loading console data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== 'ADMIN') {
        router.push('/account');
        return;
      }
      loadAdminData();
    }
  }, [isAuthenticated, user]);

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await fetchApi(`/admin/orders/${selectedOrder._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });
      alert('Order status updated successfully!');
      setSelectedOrder(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockEditSku) return;
    try {
      await fetchApi('/admin/inventory/stock', {
        method: 'PATCH',
        body: JSON.stringify({
          variantSku: stockEditSku,
          changeAmount: stockChangeVal,
          reason: stockReason,
        }),
      });
      alert('Inventory adjusted.');
      setStockEditSku(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    }
  };

  const handleCreateQuotation = async (enquiry: any) => {
    const unitPrice = prompt('Enter wholesale unit price in Rupees per 1000ml (e.g. 850):', '850');
    if (!unitPrice) return;
    try {
      await fetchApi('/b2b/quotations', {
        method: 'POST',
        body: JSON.stringify({
          enquiryId: enquiry._id,
          items: [
            {
              product: enquiry.interestedProducts?.[0]?._id || products[0]?._id,
              productName: 'Commercial Botanical Concentrate (1000ml Barista)',
              variantSku: 'AB-COMMERCIAL-1000',
              variantName: '1000ml Cafe Barista Pack',
              unitPriceInPaise: parseInt(unitPrice, 10) * 100,
              quantity: enquiry.estimatedMonthlyVolumeLiters || 20,
            },
          ],
          freightInPaise: 0,
          terms: 'Standard 30-day payment credit for vetted hospitality establishment.',
        }),
      });
      alert('Official Commercial Quotation generated and linked to enquiry!');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create quotation');
    }
  };

  if (isLoading) {
    return <div className={styles.adminLoading}>Loading Aranya Administration Console...</div>;
  }

  return (
    <div className={styles.adminPage}>
      {/* Top Console Bar */}
      <div className={styles.adminBar}>
        <div className={styles.container}>
          <div className={styles.barContent}>
            <div>
              <span className={styles.barBadge}>ARANYA OPERATIONAL SUITE</span>
              <h1>Executive Administrative Dashboard</h1>
            </div>
            <button onClick={loadAdminData} className={styles.refreshBtn}>
              <RefreshCw size={14} /> Sync Live Data
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Navigation Tabs */}
        <div className={styles.adminTabs}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          >
            <BarChart3 size={16} /> Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          >
            <ShoppingBag size={16} /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.activeTab : ''}`}
          >
            <Package size={16} /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`${styles.tabBtn} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
          >
            <AlertTriangle size={16} /> Inventory & Batches ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('b2b')}
            className={`${styles.tabBtn} ${activeTab === 'b2b' ? styles.activeTab : ''}`}
          >
            <Building2 size={16} /> B2B Trade Enquiries ({b2bEnquiries.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className={styles.overviewSection}>
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Total Commerce Revenue</span>
                <span className={styles.kpiValue}>
                  ₹{((metrics?.totalRevenueInPaise || 0) / 100).toFixed(0)}
                </span>
                <span className={styles.kpiSub}>PAID customer transactions</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Orders Placed</span>
                <span className={styles.kpiValue}>{metrics?.totalOrders || orders.length}</span>
                <span className={styles.kpiSub}>Pan-India dispatches</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Registered Connoisseurs</span>
                <span className={styles.kpiValue}>{metrics?.totalCustomers || 12}</span>
                <span className={styles.kpiSub}>Active member profiles</span>
              </div>

              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Pending B2B Enquiries</span>
                <span className={styles.kpiValue}>{metrics?.pendingB2BCount || b2bEnquiries.length}</span>
                <span className={styles.kpiSub}>Hospitality wholesale reviews</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className={styles.recentOrdersCard}>
              <h3>Recent Dispatches & Orders</h3>
              <div className={styles.ordersTableWrapper}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer Email</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Fulfillment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id}>
                        <td><strong>{o.orderNumber}</strong></td>
                        <td>{o.customerEmail}</td>
                        <td>₹{(o.totalAmountInPaise / 100).toFixed(0)}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[o.paymentStatus] || ''}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${styles[o.status] || ''}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setNewStatus(o.status);
                              setTrackingNumber(o.trackingNumber || '');
                            }}
                            className={styles.actionBtn}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Commerce Order Management</h2>
              <p>Manage order fulfillment, tracking numbers, and cancellation states.</p>
            </div>

            <div className={styles.ordersTableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Destination</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{o.customerEmail}</td>
                      <td>{o.shippingAddress?.city}, {o.shippingAddress?.state}</td>
                      <td>₹{(o.totalAmountInPaise / 100).toFixed(0)}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[o.paymentStatus] || ''}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[o.status] || ''}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setNewStatus(o.status);
                            setTrackingNumber(o.trackingNumber || '');
                          }}
                          className={styles.actionBtn}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeaderBetween}>
              <div>
                <h2>Botanical Product Catalogue</h2>
                <p>Manage active products, variants, pricing in paise, and publishing status.</p>
              </div>
              <button
                onClick={() => alert('New product formulation modal: Configure title, slug, variants, ingredients, dilution ratios, and nutritional facts.')}
                className={styles.primaryActionBtn}
              >
                <Plus size={16} /> New Concentrate
              </button>
            </div>

            <div className={styles.productsTableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Dilution</th>
                    <th>Variants</th>
                    <th>Price Range</th>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className={styles.tableProd}>
                          <img src={p.images[0]} alt={p.name} />
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td>{p.category?.name || 'Concentrate'}</td>
                      <td>1:{p.dilutionRatio?.waterOrSodaParts || 5}</td>
                      <td>{p.variants?.length || 1} Formats</td>
                      <td>
                        ₹{(p.variants?.[0]?.priceInPaise / 100).toFixed(0)} - ₹{(p.variants?.[p.variants.length - 1]?.priceInPaise / 100).toFixed(0)}
                      </td>
                      <td>
                        <span className={p.isPublished ? styles.publishedPill : styles.draftPill}>
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY & STOCK MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Inventory & Warehouse Stock Audit</h2>
              <p>Track real-time bottle reserves, low stock alerts, and adjustment audit logs.</p>
            </div>

            <div className={styles.inventoryTableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Product / Variant SKU</th>
                    <th>Available Stock</th>
                    <th>Reserved Stock</th>
                    <th>Threshold</th>
                    <th>Status</th>
                    <th>Adjustment</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((inv) => (
                    <tr key={inv._id}>
                      <td>
                        <strong>{inv.variantSku}</strong>
                        <span className={styles.subText}>{inv.product?.name}</span>
                      </td>
                      <td><strong>{inv.availableStock} bottles</strong></td>
                      <td>{inv.reservedStock} reserved</td>
                      <td>{inv.lowStockThreshold} units</td>
                      <td>
                        {inv.availableStock <= inv.lowStockThreshold ? (
                          <span className={styles.stockLowBadge}>LOW STOCK</span>
                        ) : (
                          <span className={styles.stockOkBadge}>HEALTHY</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setStockEditSku(inv.variantSku);
                            setStockChangeVal(50);
                          }}
                          className={styles.actionBtn}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: B2B TRADE ENQUIRIES */}
        {activeTab === 'b2b' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Hospitality Trade & Wholesale Enquiries</h2>
              <p>Review cafe and hotel volume requests and prepare official commercial quotations.</p>
            </div>

            <div className={styles.b2bTableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Establishment</th>
                    <th>Contact Person</th>
                    <th>Type</th>
                    <th>Volume (L/Mo)</th>
                    <th>Status</th>
                    <th>Quotation</th>
                  </tr>
                </thead>
                <tbody>
                  {b2bEnquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>
                        <strong>{enq.businessName}</strong>
                        <span className={styles.subText}>{enq.city}, {enq.state}</span>
                      </td>
                      <td>
                        <span>{enq.contactPerson}</span>
                        <span className={styles.subText}>{enq.email}</span>
                      </td>
                      <td>{enq.businessType}</td>
                      <td><strong>{enq.estimatedMonthlyVolumeLiters} Liters</strong></td>
                      <td>
                        <span className={`${styles.badge} ${styles[enq.status] || ''}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        {enq.quotationRef ? (
                          <span className={styles.quoteSentTag}>Quotation Sent</span>
                        ) : (
                          <button
                            onClick={() => handleCreateQuotation(enq)}
                            className={styles.quoteBtn}
                          >
                            Generate Quotation
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Status Modal */}
        {selectedOrder && (
          <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3>Update Order #{selectedOrder.orderNumber}</h3>
              <form onSubmit={handleUpdateOrderStatus}>
                <div className={styles.modalInputGroup}>
                  <label>Order Fulfillment Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className={styles.modalInputGroup}>
                  <label>Courier Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DEL-IND-9843210"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setSelectedOrder(null)} className={styles.cancelModalBtn}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveModalBtn}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {stockEditSku && (
          <div className={styles.modalOverlay} onClick={() => setStockEditSku(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3>Adjust Stock for {stockEditSku}</h3>
              <form onSubmit={handleAdjustStock}>
                <div className={styles.modalInputGroup}>
                  <label>Adjustment Units (+/- bottles)</label>
                  <input
                    type="number"
                    value={stockChangeVal}
                    onChange={(e) => setStockChangeVal(parseInt(e.target.value, 10))}
                  />
                </div>
                <div className={styles.modalInputGroup}>
                  <label>Reason for Adjustment</label>
                  <input
                    type="text"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setStockEditSku(null)} className={styles.cancelModalBtn}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveModalBtn}>
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
