'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';
import type { Product } from '@/types/store';

export default function ProductCard({ product, index }: { product: Product, index: number }) {
  const { addToCart } = useCart();

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.3) }} // ✅ Fix 7: capped at 300ms
    >
      <div className={styles.imageWrapper}>
        <div className={styles.badges}>
          {product.isNew && <span className={styles.newBadge}>New</span>}
          {product.isBestseller && <span className={styles.bestsellerBadge}>Bestseller</span>}
          {discountPercentage > 0 && <span className={styles.discountBadge}>-{discountPercentage}%</span>}
        </div>
        
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        
        <div className={styles.overlay}>
          <button 
            onClick={() => addToCart(product)}
            className={styles.addBtn}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <span className={styles.state}>{product.state}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceContainer}>
          <span className={styles.price}>₹{product.price}</span>
          {product.discountPrice && (
            <span className={styles.oldPrice}>₹{product.discountPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}