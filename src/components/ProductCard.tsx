'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';
import type { Product } from '@/types/store';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();

  const discountPercentage = product.discountPrice
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className={styles.card} style={{ animationDelay: `${Math.min(index * 0.08, 0.3)}s` }}>
      {/* Clickable image → product detail page */}
      <Link href={`/products/${product.id}`} className={styles.imageWrapper}>
        <div className={styles.badges}>
          {product.isNew && <span className={styles.newBadge}>New</span>}
          {product.isBestseller && <span className={styles.bestsellerBadge}>Bestseller</span>}
          {discountPercentage > 0 && (
            <span className={styles.discountBadge}>-{discountPercentage}%</span>
          )}
        </div>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
          loading={index < 4 ? 'eager' : 'lazy'}
        />
      </Link>

      <div className={styles.details}>
        <span className={styles.state}>{product.state}</span>

        {/* Clickable title → product detail page */}
        <Link href={`/products/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <div className={styles.priceContainer}>
          <span className={styles.price}>₹{product.price}</span>
          {product.discountPrice && (
            <span className={styles.oldPrice}>₹{product.discountPrice}</span>
          )}
        </div>

        <div className={styles.cardActions}>
          {/* Add to Cart — does NOT navigate */}
          <button onClick={handleAddToCart} className={styles.addToCartBtn}>
            Add to Cart
          </button>
          {/* View Details → product detail page */}
          <Link href={`/products/${product.id}`} className={styles.viewDetailsBtn}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}