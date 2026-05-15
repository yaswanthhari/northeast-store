import React from 'react';
import styles from '@/styles/legal.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>Last updated: May 15, 2026</p>
        </div>
      </header>

      <main className="container py-16">
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact our customer support. This includes:
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Delivery address</li>
              <li>Payment details (processed securely by our partners)</li>
              <li>Order history</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Process and deliver your orders</li>
              <li>Communicate with you about your account and orders</li>
              <li>Improve our website and services</li>
              <li>Send you promotional offers (with your consent)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We only share data with trusted third parties necessary to provide our services, such as shipping partners and payment processors.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Your Choices</h2>
            <p>
              You can access, update, or delete your account information at any time through your account settings. You can also opt-out of marketing communications by following the unsubscribe instructions in our emails.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
