'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} glass`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/logo.jpg" 
            alt="Northeast Store Logo" 
            width={150} 
            height={150} 
            className={styles.logoImage} 
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/products" className={styles.navLink}>Shop</Link>
          <Link href="/story" className={styles.navLink}>Our Story</Link>
          <Link href="/categories" className={styles.navLink}>Categories</Link>
        </nav>

        <div className={styles.iconActions}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={20} />
          </button>
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <ShoppingCart size={20} />
            <span className={styles.cartBadge}>0</span>
          </Link>
          <Link href="/login" className={styles.iconBtn} aria-label="User Account">
            <User size={20} />
          </Link>
          
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileNav}>
          <Link href="/products" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link href="/story" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
          <Link href="/categories" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
        </nav>
      )}
    </header>
  );
}
