import React from 'react';
import styles from '@/styles/legal.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Terms & Conditions</h1>
          <p className={styles.subtitle}>Last updated: May 15, 2026</p>
        </div>
      </header>

      <main className="container py-16">
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using NortheastStore.in, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, do not use this website.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Product Information</h2>
            <p>
              We strive to be as accurate as possible with our product descriptions and pricing. However, we do not warrant that product descriptions or other content are accurate, complete, or error-free.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Limitation of Liability</h2>
            <p>
              The NorthEast Store shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or products.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Guwahati, Assam.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
