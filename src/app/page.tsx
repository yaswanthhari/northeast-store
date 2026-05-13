'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mountain, HeartHandshake, Leaf, ShoppingBag } from 'lucide-react';
import styles from './page.module.css';

const featuredProducts = [
  {
    id: 1,
    name: 'Organic Black Rice',
    price: 350,
    state: 'Assam',
    image: '/black_rice.png',
  },
  {
    id: 2,
    name: 'Naga King Chili (Raja Mircha)',
    price: 450,
    state: 'Nagaland',
    image: '/king_chili.png',
  },
  {
    id: 3,
    name: 'Large Cardamom',
    price: 800,
    state: 'Sikkim',
    image: '/cardamom.png',
  },
  {
    id: 4,
    name: 'Lakadong Turmeric',
    price: 500,
    state: 'Meghalaya',
    image: '/turmeric.png',
  }
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            NortheastStore.in
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover unique, region-specific organic and traditional food products from all eight states of Northeast India, sourced directly from local producers.
          </motion.p>
          <motion.div 
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="/products" className="btn btn-accent">
              Shop the Collection
            </Link>
            <Link href="/story" className="btn btn-outline glass" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
              Discover Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Authentic Foods</h2>
            <Link href="/products" className={styles.viewAll}>View All →</Link>
          </div>
          
          <div className={styles.productGrid}>
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                className={styles.productCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.imageContainer}>
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className={styles.productImage}
                  />
                  <div className={styles.imageOverlay}></div>
                  <span className={styles.stateTag}>{product.state}</span>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productFooter}>
                    <p className={styles.productPrice}>₹{product.price.toLocaleString()}</p>
                    <button className={styles.addToCartBtn}>+</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className={`${styles.section} ${styles.promiseSection}`}>
        <div className="container">
          <div className={styles.promiseGrid}>
            <motion.div 
              className={styles.promiseItem}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.promiseIcon}><Mountain size={40} color="var(--color-primary)" strokeWidth={1.5} /></div>
              <h3 className={styles.promiseTitle}>Cultural Promotion</h3>
              <p>Preserving and showcasing the unique food culture and heritage of Northeast India.</p>
            </motion.div>
            <motion.div 
              className={styles.promiseItem}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={styles.promiseIcon}><HeartHandshake size={40} color="var(--color-primary)" strokeWidth={1.5} /></div>
              <h3 className={styles.promiseTitle}>Community Support</h3>
              <p>Empowering local farmers, artisans, and small businesses with a wider reach.</p>
            </motion.div>
            <motion.div 
              className={styles.promiseItem}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.promiseIcon}><Leaf size={40} color="var(--color-primary)" strokeWidth={1.5} /></div>
              <h3 className={styles.promiseTitle}>Authentic Access</h3>
              <p>Providing genuine, high-quality organic and traditional products.</p>
            </motion.div>
            <motion.div 
              className={styles.promiseItem}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className={styles.promiseIcon}><ShoppingBag size={40} color="var(--color-primary)" strokeWidth={1.5} /></div>
              <h3 className={styles.promiseTitle}>Seamless Experience</h3>
              <p>Delivering a smooth and accessible online shopping experience for regional goods.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
