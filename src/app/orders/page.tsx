'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ChevronDown, 
  Package, 
  Truck, 
  Star, 
  CheckCircle2, 
  X, 
  Printer, 
  ShoppingBag, 
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';
import styles from './orders.module.css';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    state: string;
  };
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controls
  const [activeTab, setActiveTab] = useState<'orders' | 'buy_again' | 'not_shipped'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('3_months');

  // Modals
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [feedbackType, setFeedbackType] = useState<'seller' | 'delivery' | null>(null);
  const [feedbackOrder, setFeedbackOrder] = useState<Order | null>(null);
  const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string; image: string } | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);

  // Form states in modals
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Dropdown UI states
  const [openShipTo, setOpenShipTo] = useState<string | null>(null);
  const [openInvoiceMenu, setOpenInvoiceMenu] = useState<string | null>(null);

  // ✅ Fix: redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [authLoading, isAuthenticated, router]);

  // ✅ Fix: only fetch orders when user is confirmed logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Run filters whenever dependencies change
  useEffect(() => {
    let result = [...orders];

    // 1. Time filtering
    const now = new Date();
    result = result.filter(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilter === '3_months') return diffDays <= 90;
      if (timeFilter === '6_months') return diffDays <= 180;
      if (timeFilter === '2026') return orderDate.getFullYear() === 2026;
      if (timeFilter === '2025') return orderDate.getFullYear() === 2025;
      return true; // all_time
    });

    // 2. Tab filtering
    if (activeTab === 'not_shipped') {
      result = result.filter(order => order.status === 'PENDING');
    }

    // 3. Search filtering
    if (appliedSearch.trim()) {
      const query = appliedSearch.toLowerCase().trim();
      result = result.filter(order => {
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesProduct = order.items.some(item =>
          item.product?.name?.toLowerCase().includes(query)
        );
        return matchesId || matchesProduct;
      });
    }

    setFilteredOrders(result);
  }, [orders, activeTab, appliedSearch, timeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAppliedSearch('');
  };

  const handleBuyItAgain = (product: OrderItem['product']) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const getUniqueOrderedProducts = () => {
    const productsMap = new Map<string, OrderItem['product']>();
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && !productsMap.has(item.product.id)) {
          productsMap.set(item.product.id, item.product);
        }
      });
    });
    return Array.from(productsMap.values());
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  };

  const getReturnWindowDate = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isReturnWindowActive = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 30);
    return new Date() < date;
  };

  // ✅ Fix: honest feedback message — feature coming soon
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess('Thank you! Feedback feature coming soon.');
    setTimeout(() => {
      setFeedbackType(null);
      setFeedbackOrder(null);
      setComments('');
      setRating(5);
      setModalSuccess(null);
    }, 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess('Thank you! Review feature coming soon.');
    setTimeout(() => {
      setReviewProduct(null);
      setComments('');
      setRating(5);
      setModalSuccess(null);
    }, 2000);
  };

  // Show loading while checking auth or fetching orders
  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className={styles.loadingState}>
        <RefreshCw className={styles.spinner} />
        <p>Loading your orders...</p>
      </div>
    );
  }

  // Don't render page content for unauthenticated users (redirect is in progress)
  if (!isAuthenticated) return null;

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/dashboard">Your Account</Link>
          <span>&gt;</span>
          <span className={styles.activeBreadcrumb}>Your Orders</span>
        </div>

        {/* Header Block */}
        <header className={styles.header}>
          <h1 className={styles.title}>Your Orders</h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
            <div className={styles.searchInputContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search all orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button type="button" onClick={clearSearch} className={styles.clearSearchBtn}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className={styles.searchBtn}>Search Orders</button>
          </form>
        </header>

        {/* Tab system */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
              onClick={() => { setActiveTab('orders'); clearSearch(); }}
            >
              Orders
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'buy_again' ? styles.activeTab : ''}`}
              onClick={() => { setActiveTab('buy_again'); clearSearch(); }}
            >
              Buy Again
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'not_shipped' ? styles.activeTab : ''}`}
              onClick={() => { setActiveTab('not_shipped'); clearSearch(); }}
            >
              Not Yet Shipped
            </button>
          </div>
        </div>

        {/* Time period filter */}
        {activeTab !== 'buy_again' && (
          <div className={styles.filterBar}>
            <div className={styles.filterLabel}>
              <span className={styles.countText}>
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} placed in
              </span>
              <div className={styles.dropdownSelectWrapper}>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className={styles.timeDropdown}
                >
                  <option value="3_months">past 3 months</option>
                  <option value="6_months">past 6 months</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="all_time">all time</option>
                </select>
                <ChevronDown className={styles.dropdownIcon} size={14} />
              </div>
            </div>
          </div>
        )}

        {/* Errors & Alerts */}
        {error && (
          <div className={styles.errorAlert}>
            <AlertTriangle size={20} />
            <p>{error}</p>
            <button onClick={fetchOrders} className={styles.retryBtn}>Retry</button>
          </div>
        )}

        {/* Content Display */}
        {activeTab === 'buy_again' ? (
          <div className={styles.buyAgainGrid}>
            {getUniqueOrderedProducts().length === 0 ? (
              <div className={styles.emptyState}>
                <ShoppingBag size={48} />
                <h3>No items to buy again</h3>
                <p>Order some regional organic delights, and they will show up here for rapid one-click reordering.</p>
                <Link href="/products" className={styles.shopBtn}>Explore Store</Link>
              </div>
            ) : (
              getUniqueOrderedProducts().map(product => (
                <div key={product.id} className={styles.buyAgainCard}>
                  <div className={styles.buyAgainImgWrapper}>
                    <Image
                      src={product.image || '/logo.jpg'}
                      alt={product.name}
                      width={160}
                      height={160}
                      className={styles.buyAgainImg}
                    />
                  </div>
                  <div className={styles.buyAgainInfo}>
                    {/* ✅ Fix: link to specific product */}
                    <Link href={`/products/${product.id}`} className={styles.buyAgainName}>
                      {product.name}
                    </Link>
                    <div className={styles.buyAgainPrice}>₹{product.price.toFixed(2)}</div>
                    <button
                      onClick={() => handleBuyItAgain(product)}
                      className={styles.buyAgainActionBtn}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={48} />
                <h3>
                  {orders.length === 0 ? "You haven't placed any orders yet" : "No orders found"}
                </h3>
                <p>
                  {orders.length === 0
                    ? "Experience the rich taste of Northeast India by placing your very first order today!"
                    : (appliedSearch
                      ? `No orders matching "${appliedSearch}" found for the selected time filter.`
                      : "You haven't placed any orders in this period."
                    )
                  }
                </p>
                <Link href="/products" className={styles.shopBtn}>Order Now / Explore Products</Link>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className={styles.orderCard}>

                  {/* Card Header */}
                  <header className={styles.orderCardHeader}>
                    <div className={styles.headerMetadata}>
                      <div className={styles.metaCol}>
                        <span className={styles.metaLabel}>ORDER PLACED</span>
                        <span className={styles.metaValue}>{formatDate(order.createdAt)}</span>
                      </div>

                      <div className={styles.metaCol}>
                        <span className={styles.metaLabel}>TOTAL</span>
                        <span className={styles.metaValue}>₹{order.total.toFixed(2)}</span>
                      </div>

                      <div className={`${styles.metaCol} ${styles.shipToCol}`}>
                        <span className={styles.metaLabel}>SHIP TO</span>
                        <button
                          className={styles.shipToButton}
                          onClick={() => setOpenShipTo(openShipTo === order.id ? null : order.id)}
                        >
                          <span className={styles.shipToName}>{order.user?.name || user?.name || 'Valued Customer'}</span>
                          <ChevronDown size={12} />
                        </button>

                        {openShipTo === order.id && (
                          <div className={styles.shipToDropdown}>
                            <div className={styles.shipToArrow}></div>
                            <h4 className={styles.shipToUser}>{order.user?.name || user?.name || 'Valued Customer'}</h4>
                            <p className={styles.shipToAddress}>{order.shippingAddress}</p>
                            <p className={styles.shipToCity}>{order.city}, {order.postalCode}</p>
                            <p className={styles.shipToCountry}>India</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.headerOrderDetails}>
                      <div className={styles.orderNumberContainer}>
                        <span className={styles.metaLabel}>ORDER # {order.id.slice(0, 18)}...</span>
                      </div>
                      <div className={styles.headerLinks}>
                        <button
                          onClick={() => setActiveInvoice(order)}
                          className={styles.headerActionLink}
                        >
                          View order details
                        </button>
                        <span className={styles.headerSeparator}>|</span>

                        <div className={styles.invoiceMenuContainer}>
                          <button
                            onClick={() => setOpenInvoiceMenu(openInvoiceMenu === order.id ? null : order.id)}
                            className={styles.headerActionLink}
                          >
                            Invoice <ChevronDown size={10} style={{ display: 'inline', marginLeft: 2 }} />
                          </button>

                          {openInvoiceMenu === order.id && (
                            <div className={styles.invoiceMenu}>
                              <button
                                onClick={() => { setActiveInvoice(order); setOpenInvoiceMenu(null); }}
                                className={styles.invoiceMenuItem}
                              >
                                <FileText size={14} /> View Invoice
                              </button>
                              <button
                                onClick={() => {
                                  setOpenInvoiceMenu(null);
                                  setTimeout(() => window.print(), 300);
                                }}
                                className={styles.invoiceMenuItem}
                              >
                                <Printer size={14} /> Print Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Card Body */}
                  <div className={styles.orderCardBody}>
                    <div className={styles.cardItemsList}>

                      {/* Delivery Status */}
                      <div className={styles.deliveryStatusRow}>
                        <h3 className={styles.statusTitle}>
                          {order.status === 'COMPLETED' ? (
                            <>Delivered on {getReturnWindowDate(order.createdAt).split(' ').slice(0, 2).join(' ')}</>
                          ) : order.status === 'CANCELLED' ? (
                            <span className={styles.cancelledText}>Cancelled</span>
                          ) : (
                            <>Arriving Soon (Expected within 3-4 days)</>
                          )}
                        </h3>
                        {order.status === 'PENDING' && (
                          <p className={styles.statusDetails}>Package is currently being freshly packaged by our local Northeast farmers.</p>
                        )}
                        {order.status === 'COMPLETED' && (
                          <p className={styles.statusDetails}>Package was handed directly to resident. Verified signature secured.</p>
                        )}
                      </div>

                      {/* Items */}
                      {order.items.map(item => (
                        <div key={item.id} className={styles.itemRow}>
                          <div className={styles.itemImageContainer}>
                            <Image
                              src={item.product?.image || '/logo.jpg'}
                              alt={item.product?.name || 'Delicacy'}
                              width={90}
                              height={90}
                              className={styles.itemImage}
                            />
                          </div>

                          <div className={styles.itemDetails}>
                            {/* ✅ Fix: link to specific product */}
                            <Link href={`/products/${item.product?.id}`} className={styles.itemName}>
                              {item.product?.name || 'Authentic Northeast Food Item'}
                            </Link>
                            <p className={styles.itemMetaInfo}>
                              Sold by: <span className={styles.vendorName}>NortheastStore Local Cooperatives</span>
                            </p>
                            <div className={styles.itemQuantityAndPrice}>
                              <span>Quantity: {item.quantity}</span>
                              <span className={styles.bulletSeparator}>•</span>
                              <span className={styles.itemPriceText}>₹{item.price.toFixed(2)}</span>
                            </div>

                            {order.status === 'COMPLETED' && (
                              <p className={styles.returnWindowText}>
                                {isReturnWindowActive(order.createdAt) ? (
                                  <>Return window open until {getReturnWindowDate(order.createdAt)}</>
                                ) : (
                                  <>Return window closed on {getReturnWindowDate(order.createdAt)}</>
                                )}
                              </p>
                            )}

                            <div className={styles.itemActionButtons}>
                              <button
                                onClick={() => handleBuyItAgain(item.product)}
                                className={styles.buyItAgainBtn}
                              >
                                <RefreshCw size={14} className={styles.actionBtnIcon} />
                                Buy it again
                              </button>
                              {/* ✅ Fix: link to specific product */}
                              <Link href={`/products/${item.product?.id}`} className={styles.viewItemBtn}>
                                View your item
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Column Actions */}
                    <div className={styles.orderActionsColumn}>
                      {order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className={`${styles.actionButton} ${styles.primaryActionButton}`}
                        >
                          Track package
                        </button>
                      )}

                      <button
                        onClick={() => { setFeedbackOrder(order); setFeedbackType('seller'); }}
                        className={styles.actionButton}
                      >
                        Leave seller feedback
                      </button>

                      <button
                        onClick={() => { setFeedbackOrder(order); setFeedbackType('delivery'); }}
                        className={styles.actionButton}
                      >
                        Leave delivery feedback
                      </button>

                      {order.items.length > 0 && (
                        <button
                          onClick={() => setReviewProduct({
                            id: order.items[0].product.id,
                            name: order.items[0].product.name,
                            image: order.items[0].product.image,
                          })}
                          className={styles.actionButton}
                        >
                          Write a product review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MODAL 1: TRACKING */}
        {trackingOrder && (
          <div className={styles.modalOverlay} onClick={() => setTrackingOrder(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalCloseBtn} onClick={() => setTrackingOrder(null)}>
                <X size={20} />
              </button>

              <h2 className={styles.modalTitle}>
                <Truck size={24} style={{ marginRight: 8, color: '#12402b' }} />
                Track Shipment
              </h2>
              <p className={styles.modalSubtitle}>Order ID: #{trackingOrder.id}</p>

              <div className={styles.timeline}>
                <div className={`${styles.timelineStep} ${styles.stepCompleted}`}>
                  <div className={styles.stepIndicator}><CheckCircle2 size={16} /></div>
                  <div className={styles.stepContent}>
                    <h4>Ordered</h4>
                    <p>{formatDate(trackingOrder.createdAt)}</p>
                  </div>
                </div>

                <div className={`${styles.timelineStep} ${styles.stepCompleted}`}>
                  <div className={styles.stepIndicator}><CheckCircle2 size={16} /></div>
                  <div className={styles.stepContent}>
                    <h4>Processed & Packed</h4>
                    <p>Prepared in traditional handcraft bags</p>
                  </div>
                </div>

                <div className={`${styles.timelineStep} ${trackingOrder.status === 'COMPLETED' ? styles.stepCompleted : styles.stepActive}`}>
                  <div className={styles.stepIndicator}>
                    {trackingOrder.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <div className={styles.pulseDot}></div>}
                  </div>
                  <div className={styles.stepContent}>
                    <h4>In Transit</h4>
                    <p>{trackingOrder.status === 'COMPLETED' ? 'Shipped via Northeast Organic Air Cargo' : 'Dispatched from Guwahati Depot'}</p>
                  </div>
                </div>

                <div className={`${styles.timelineStep} ${trackingOrder.status === 'COMPLETED' ? styles.stepCompleted : styles.stepPending}`}>
                  <div className={styles.stepIndicator}>
                    {trackingOrder.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <div className={styles.emptyDot}></div>}
                  </div>
                  <div className={styles.stepContent}>
                    <h4>Out for Delivery</h4>
                    <p>{trackingOrder.status === 'COMPLETED' ? 'Completed local route courier' : 'Pending regional arrival'}</p>
                  </div>
                </div>

                <div className={`${styles.timelineStep} ${trackingOrder.status === 'COMPLETED' ? styles.stepCompleted : styles.stepPending} ${styles.lastStep}`}>
                  <div className={styles.stepIndicator}>
                    {trackingOrder.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <div className={styles.emptyDot}></div>}
                  </div>
                  <div className={styles.stepContent}>
                    <h4>Delivered</h4>
                    <p>{trackingOrder.status === 'COMPLETED' ? 'Handed over securely to recipient' : 'Estimated: 3-4 days'}</p>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.closeBtn} onClick={() => setTrackingOrder(null)}>Done</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: FEEDBACK */}
        {feedbackType && feedbackOrder && (
          <div className={styles.modalOverlay} onClick={() => { setFeedbackType(null); setFeedbackOrder(null); }}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalCloseBtn} onClick={() => { setFeedbackType(null); setFeedbackOrder(null); }}>
                <X size={20} />
              </button>

              <h2 className={styles.modalTitle}>
                {feedbackType === 'seller' ? 'Leave Seller Feedback' : 'Leave Delivery Feedback'}
              </h2>
              <p className={styles.modalSubtitle}>For Order: #{feedbackOrder.id.slice(0, 15)}...</p>

              {modalSuccess ? (
                <div className={styles.modalSuccessMsg}>
                  <CheckCircle2 size={36} className={styles.successTick} />
                  <p>{modalSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className={styles.modalForm}>
                  <div className={styles.ratingGroup}>
                    <label className={styles.formLabel}>Rate your experience:</label>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={styles.starBtn}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star
                            size={28}
                            fill={(hoverRating || rating) >= star ? '#d4af37' : 'none'}
                            color={(hoverRating || rating) >= star ? '#d4af37' : '#ccd0cf'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.formLabel}>Write a brief comment:</label>
                    <textarea
                      required
                      placeholder={feedbackType === 'seller'
                        ? 'Describe your experience with the products, packaging authenticity, and freshness...'
                        : 'Describe your delivery experience, courtesy, package protection, and speed...'
                      }
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button type="submit" className={styles.submitBtn}>Submit Feedback</button>
                    <button
                      type="button"
                      onClick={() => { setFeedbackType(null); setFeedbackOrder(null); }}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 3: PRODUCT REVIEW */}
        {reviewProduct && (
          <div className={styles.modalOverlay} onClick={() => setReviewProduct(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalCloseBtn} onClick={() => setReviewProduct(null)}>
                <X size={20} />
              </button>

              <h2 className={styles.modalTitle}>Write a Customer Review</h2>
              <div className={styles.reviewProductMeta}>
                <Image
                  src={reviewProduct.image || '/logo.jpg'}
                  alt={reviewProduct.name}
                  width={60}
                  height={60}
                  className={styles.reviewProductImg}
                />
                <h4 className={styles.reviewProductName}>{reviewProduct.name}</h4>
              </div>

              {modalSuccess ? (
                <div className={styles.modalSuccessMsg}>
                  <CheckCircle2 size={36} className={styles.successTick} />
                  <p>{modalSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className={styles.modalForm}>
                  <div className={styles.ratingGroup}>
                    <label className={styles.formLabel}>Overall Rating:</label>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={styles.starBtn}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star
                            size={28}
                            fill={(hoverRating || rating) >= star ? '#d4af37' : 'none'}
                            color={(hoverRating || rating) >= star ? '#d4af37' : '#ccd0cf'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.formLabel}>Review description:</label>
                    <textarea
                      required
                      placeholder="What did you like or dislike? How does it taste? Share your culinary secrets!"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className={styles.modalTextarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button type="submit" className={styles.submitBtn}>Submit Review</button>
                    <button
                      type="button"
                      onClick={() => setReviewProduct(null)}
                      className={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 4: INVOICE */}
        {activeInvoice && (
          <div className={styles.modalOverlay} onClick={() => setActiveInvoice(null)}>
            <div className={`${styles.modalContent} ${styles.invoiceModalWidth}`} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalCloseBtn} onClick={() => setActiveInvoice(null)}>
                <X size={20} />
              </button>

              <div className={styles.printableInvoice} id="printable-invoice-content">
                <header className={styles.invoiceHeader}>
                  <div className={styles.invoiceBranding}>
                    <Image
                      src="/logo.jpg"
                      alt="Northeast Store Logo"
                      width={120}
                      height={40}
                      className={styles.invoiceLogo}
                    />
                    <h2 className={styles.invoiceTitle}>Invoice / Payment Receipt</h2>
                  </div>
                  <div className={styles.invoiceMetadata}>
                    <p><strong>Order ID:</strong> {activeInvoice.id}</p>
                    <p><strong>Date:</strong> {formatDate(activeInvoice.createdAt)}</p>
                    <p><strong>Status:</strong> {activeInvoice.status}</p>
                  </div>
                </header>

                <hr className={styles.invoiceDivider} />

                <div className={styles.invoiceParties}>
                  <div className={styles.partyCol}>
                    <h5>Sold By:</h5>
                    <p><strong>NortheastStore.in</strong></p>
                    <p>Guwahati Organic Hub, Near Airport Rd</p>
                    <p>Guwahati, Assam - 781015</p>
                    <p>GSTIN: 18AAAAA0000A1Z2</p>
                  </div>

                  <div className={styles.partyCol}>
                    <h5>Shipping Address:</h5>
                    <p><strong>{activeInvoice.user?.name || user?.name || 'Valued Customer'}</strong></p>
                    <p>{activeInvoice.shippingAddress}</p>
                    <p>{activeInvoice.city}, {activeInvoice.postalCode}</p>
                    <p>India</p>
                  </div>
                </div>

                <table className={styles.invoiceTable}>
                  <thead>
                    <tr>
                      <th>Product Details</th>
                      <th className={styles.textCenter}>Qty</th>
                      <th className={styles.textRight}>Unit Price</th>
                      <th className={styles.textRight}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeInvoice.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.product?.name || 'Northeast Food Special'}</strong>
                          <p className={styles.tableProductState}>Origin state: {item.product?.state || 'Northeast'}</p>
                        </td>
                        <td className={styles.textCenter}>{item.quantity}</td>
                        <td className={styles.textRight}>₹{item.price.toFixed(2)}</td>
                        <td className={styles.textRight}>₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.invoiceSummary}>
                  <div className={styles.summaryTable}>
                    <div className={styles.summaryTableRow}>
                      <span>Subtotal:</span>
                      <span>₹{activeInvoice.total.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryTableRow}>
                      <span>Shipping & Handling:</span>
                      <span className={styles.freeText}>₹0.00 (FREE)</span>
                    </div>
                    <div className={`${styles.summaryTableRow} ${styles.grandTotalRow}`}>
                      <span>Grand Total:</span>
                      <span>₹{activeInvoice.total.toFixed(2)}</span>
                    </div>
                    <div className={styles.paymentMethodLabel}>
                      <span>Payment Method:</span>
                      <span>Cash on Delivery (COD)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => window.print()}
                  className={`${styles.submitBtn} ${styles.printBtn}`}
                >
                  <Printer size={16} style={{ marginRight: 6 }} /> Print Invoice
                </button>
                <button className={styles.cancelBtn} onClick={() => setActiveInvoice(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}