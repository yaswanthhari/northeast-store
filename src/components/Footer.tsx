import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.jpg" 
              alt="Northeast Store Logo" 
              width={200} 
              height={200} 
              className={styles.logoImage} 
            />
          </Link>
          <p className={styles.description}>
            Discover unique, region-specific organic and traditional food products from all eight states of Northeast India, sourced directly from local producers.
          </p>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Explore</h3>
          <ul className={styles.linkList}>
            <li><Link href="/products">Shop All</Link></li>
            <li><Link href="/story">Our Story</Link></li>
            <li><Link href="/categories">Food Categories</Link></li>
            <li><Link href="/artisans">Local Producers</Link></li>
          </ul>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Customer Service</h3>
          <ul className={styles.linkList}>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping">Shipping Policy</Link></li>
            <li><Link href="/returns">Returns</Link></li>
          </ul>
        </div>
        
        <div className={styles.newsletterSection}>
          <h3 className={styles.heading}>Stay Connected</h3>
          <p className={styles.newsletterDesc}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.input}
              required 
            />
            <button type="submit" className={`btn btn-accent ${styles.submitBtn}`}>Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Northeast Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
