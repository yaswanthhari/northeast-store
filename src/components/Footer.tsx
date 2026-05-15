import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.jpg" 
              alt="Northeast Store Logo" 
              width={160} 
              height={160} 
              className={styles.logoImage} 
            />
          </Link>
          <p className={styles.description}>
            The NorthEast Store is an online marketplace dedicated to promoting and selling authentic products from the eight states of Northeast India.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Phone size={16} />
              <span>+91 6033 046 983</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={16} />
              <span>support@northeaststore.in</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={16} />
              <span>Eight States Building, Guwahati, Assam - 781001</span>
            </div>
          </div>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Information</h3>
          <ul className={styles.linkList}>
            <li><Link href="/story">About Us</Link></li>
            <li><Link href="/delivery">Delivery</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Customer Service</h3>
          <ul className={styles.linkList}>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/returns">Returns & Cancellations</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
          </ul>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>My Account</h3>
          <ul className={styles.linkList}>
            <li><Link href="/login">My Account</Link></li>
            <li><Link href="/login">Order History</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p className={styles.copyright}>Copyright © 2014 - {new Date().getFullYear()}, The NorthEast Store Private Limited</p>
          <div className={styles.payments}>
            <span className={styles.payLabel}>We Accept:</span>
            <div className={styles.payIcons}>
              {['Cards', 'UPI', 'GPay', 'PhonePe'].map(p => (
                <Link key={p} href="/payment" className={styles.payBadge}>{p}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
