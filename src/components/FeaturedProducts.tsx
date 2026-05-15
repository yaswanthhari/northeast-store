'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from '../app/page.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  state: string;
  image: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  return (
    <div className={styles.productGrid}>
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          className={styles.productCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className={styles.imageContainer}>
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.productImage}
            />
            <div className={styles.productActionOverlay}>
              <button 
                onClick={() => addToCart(product)}
                className={styles.quickAddBtn}
              >
                Quick Add
              </button>
            </div>
          </div>
          <div className={styles.productInfo}>
            <span className={styles.stateTag}>{product.state}</span>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>₹{product.price.toLocaleString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
