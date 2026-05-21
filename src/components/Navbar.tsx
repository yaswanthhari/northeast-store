'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X, Search, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
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
          <Link href="/products" className={styles.navLink}>Food</Link>
          <Link href="/products?category=smoked-meats" className={styles.navLink}>Smoked Meats</Link>
          <Link href="/blog" className={styles.navLink}>Recipes</Link>
          <Link href="/orders" className={styles.navLink}>Orders</Link>
          {user?.role === 'ADMIN' && <Link href="/admin" className={`${styles.navLink} ${styles.adminLink}`}>Admin</Link>}
        </nav>
        
        <div className={styles.iconActions}>
          <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchActive : ''}`}>
            {isSearchOpen && (
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className={styles.searchInput}
                />
              </form>
            )}
            <button 
              className={styles.iconBtn} 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <Link 
            href="/orders" 
            className={styles.iconBtn} 
            aria-label="My Orders" 
            title="My Orders"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <ClipboardList size={20} />
            <span className={styles.ordersText} style={{ fontSize: '0.8rem', fontWeight: 600, display: 'none' }}>Orders</span>
          </Link>

          <button 
            className={styles.iconBtn} 
            aria-label="Cart"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </button>
          <Link href={isAuthenticated ? "/dashboard" : "/login"} className={styles.iconBtn} aria-label="User Account">
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
          <Link href="/products" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Food</Link>
          <Link href="/products?category=smoked-meats" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Smoked Meats</Link>
          <Link href="/blog" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Recipes</Link>
          <Link href="/orders" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
          {user?.role === 'ADMIN' && <Link href="/admin" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#d4af37', fontWeight: 700 }}>Admin Panel</Link>}
          <Link href={isAuthenticated ? "/dashboard" : "/login"} className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
            {isAuthenticated ? 'My Account' : 'Login / Register'}
          </Link>
          {isAuthenticated && (
            <button 
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }} 
              className={styles.mobileNavLink} 
              style={{ color: '#e53e3e', background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: '1rem' }}
            >
              Log Out
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
