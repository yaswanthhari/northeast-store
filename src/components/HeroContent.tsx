'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from '../app/page.module.css';

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={styles.heroTextWrapper}
    >
      <h1 className={styles.title}>
        Authentic Flavors of the<br />
        <span className={styles.titleAccent}>Eight States</span>
      </h1>
      <p className={styles.subtitle}>
        Discover rare, organic, and traditional food products sourced directly from local producers in Northeast India.
      </p>
      <div className={styles.ctaGroup}>
        <Link href="/products" className="btn btn-primary">
          Explore Products <ArrowRight size={18} />
        </Link>
        <Link href="/story" className="btn btn-accent">
          Our Story
        </Link>
      </div>
    </motion.div>
  );
}
