'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { Filter, SlidersHorizontal, Search, ChevronRight } from 'lucide-react';
import styles from './products.module.css';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import type { CategoryWithProductCount, Product } from '@/types/store';

interface ProductListProps {
  initialProducts: Product[];
  categories: CategoryWithProductCount[];
  activeCategory?: string;
}

export default function ProductList({ initialProducts, categories, activeCategory }: ProductListProps) {
  const { addToCart } = useCart();
  const [priceRange, setPriceRange] = useState(700);
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];
    
    // Client-side price filtering
    result = result.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [initialProducts, priceRange, sortBy]);

  return (
    <div className={styles.mainGrid}>
      {/* Sidebar Filter */}
      <aside className={styles.sidebar}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Price</h3>
          <div className={styles.priceFilter}>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.priceLabels}>
              <span>₹0</span>
              <span>₹{priceRange}</span>
            </div>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Subcategories</h3>
          <div className={styles.categoryList}>
            <Link 
              href="/products" 
              className={`${styles.categoryItem} ${!activeCategory ? styles.active : ''}`}
            >
              All Food
              <ChevronRight size={14} />
            </Link>
            {categories.map(cat => (
              <Link 
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`${styles.categoryItem} ${activeCategory === cat.slug ? styles.active : ''}`}
              >
                {cat.name}
                <span className={styles.catCount}>({cat._count.products})</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Weight</h3>
          <div className={styles.tagGrid}>
            {['100g', '200g', '500g', '1kg'].map(w => (
              <button key={w} className={styles.tagBtn}>{w}</button>
            ))}
          </div>
        </div>
      </aside>

      {/* Product Content */}
      <div className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.controlInfo}>
            <p className={styles.count}>Showing {filteredProducts.length} of {initialProducts.length} results</p>
          </div>
          <div className={styles.controlActions}>
            <div className={styles.sortWrapper}>
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <Search size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your filters or search query.</p>
            <button onClick={() => {setPriceRange(1000); setSortBy('default');}} className={styles.resetBtn}>Reset All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
