'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated && data.user) {
          setFormData(prev => ({
            ...prev, 
            email: data.user.email || '', 
            firstName: data.user.name?.split(' ')[0] || '',
            lastName: data.user.name?.split(' ').slice(1).join(' ') || ''
          }));
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to place an order.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: totalPrice,
          shippingDetails: formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setIsOrdered(true);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successIcon}>
          <ShieldCheck size={40} />
        </div>
        <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
        <p className={styles.successText}>
          Thank you for your purchase. We are preparing your treasures from the Northeast. You will receive an email confirmation shortly.
        </p>
        <Link href="/products" className={styles.returnBtn}>
          Return to Shop
        </Link>
      </div>
    );
  }

  if (isCheckingAuth) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p>Checking your session...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/products" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Shop
        </Link>

        {!isAuthenticated && (
          <div className={styles.loginBanner}>
            <AlertCircle size={20} />
            <p>You need to be logged in to place an order.</p>
            <Link href="/login?redirect=/checkout" className={styles.loginInlineBtn}>
              Login Now
            </Link>
          </div>
        )}

        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formContainer}>
            <section>
              <h2 className={styles.sectionTitle}>
                <Truck size={28} />
                Shipping Details
              </h2>
              {error && <div className={styles.errorMessage}>{error}</div>}
              
              <form onSubmit={handleOrder} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input 
                    required 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input 
                    required 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Email Address</label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Shipping Address</label>
                  <input 
                    required 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input 
                    required 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Postal Code</label>
                  <input 
                    required 
                    type="text" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={styles.input} 
                  />
                </div>

                <div className={`${styles.paymentMethod} ${styles.fullWidth}`}>
                  <h2 className={styles.sectionTitle}>
                    <CreditCard size={28} />
                    Payment Method
                  </h2>
                  <div className={styles.codOption}>
                    <span>Cash on Delivery (COD)</span>
                    <ShieldCheck size={20} />
                  </div>
                  <p className={styles.paymentNote}>
                    For authentic Northeast treasures, we currently only support COD to ensure safe delivery.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={cart.length === 0 || isLoading || !isAuthenticated}
                  className={styles.orderBtn}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className={styles.btnSpinner} />
                      Processing...
                    </>
                  ) : (
                    `Place Order (₹${totalPrice})`
                  )}
                </button>
              </form>
            </section>
          </div>

          {/* Summary */}
          <aside className={styles.summaryContainer}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.itemList}>
                {cart.length === 0 ? (
                  <p className="text-center text-[#12402b]/40 py-8 italic">Your cart is empty</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemDetails}>
                        <span className={styles.qtyBadge}>{item.quantity}</span>
                        <span className={styles.itemName}>{item.name}</span>
                      </div>
                      <span className={styles.itemPrice}>₹{item.price * item.quantity}</span>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span style={{ color: '#12402b', fontWeight: 600 }}>FREE</span>
                </div>
                <div className={styles.grandTotal}>
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
