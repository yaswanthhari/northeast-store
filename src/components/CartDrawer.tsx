'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className={styles.overlay}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={styles.drawer}
          >
            {/* Header */}
            <div className={styles.header}>
              <h2>
                <ShoppingBag size={24} />
                Your Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className={styles.itemList}>
              {cart.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p>Your cart is empty</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={styles.continueBtn}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <div>
                        <div className={styles.itemHeader}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className={styles.removeBtn}
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <p className={styles.itemPrice}>₹{item.price}</p>
                      </div>
                      <div className={styles.itemControls}>
                        <div className={styles.quantityPicker}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={styles.qtyBtn}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={styles.qtyBtn}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className={styles.itemTotal}>₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summary}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.totalPrice}>₹{totalPrice}</span>
                </div>
                <p className={styles.footerNote}>
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className={styles.checkoutBtn}
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
