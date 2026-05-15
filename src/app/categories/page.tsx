'use client';

import React from 'react';
import styles from './categories.module.css';
import { Shrub, Wheat, Coffee, Gift } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    {
      id: 'spices',
      name: 'Exotic Spices',
      description: 'The soul of Northeast cuisine, from Naga King Chili to Lakadong Turmeric.',
      icon: <Shrub size={32} />,
      color: '#7a214b'
    },
    {
      id: 'grains',
      name: 'Organic Grains',
      description: 'Wholesome varieties of rice and millets grown in the pristine hills.',
      icon: <Wheat size={32} />,
      color: '#12402b'
    },
    {
      id: 'beverages',
      name: 'Hill-Grown Beverages',
      description: 'Finest Orthodox teas from Assam and hand-picked coffee from Meghalaya.',
      icon: <Coffee size={32} />,
      color: '#4b3621'
    },
    {
      id: 'handicrafts',
      name: 'Traditional Crafts',
      description: 'Beautiful bamboo and cane artifacts, and hand-loomed textiles.',
      icon: <Gift size={32} />,
      color: '#d4af37'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Browse by Category</h1>
          <p className={styles.subtitle}>Explore the diverse treasures of the eight states.</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link href={`/products?category=${cat.id}`} key={cat.id} className={styles.card}>
              <div className={styles.iconWrapper} style={{ backgroundColor: cat.color }}>
                {cat.icon}
              </div>
              <div className={styles.content}>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <span className={styles.exploreBtn}>Explore Items</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
