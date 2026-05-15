import React from 'react';
import styles from './returns.module.css';

export default function ReturnsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Returns & Cancellations</h1>
          <p className={styles.subtitle}>Your satisfaction is our priority. Learn about our easy return process.</p>
        </div>
      </header>

      <main className="container py-16">
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Cancellation Policy</h2>
            <p>
              Orders can be cancelled within 2 hours of placement. Since many of our products are perishable (like Smoked Meats), we cannot accept cancellations once the order has been processed or shipped.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Return Policy</h2>
            <p>
              Due to the nature of our products (food items and perishables), we generally do not accept returns. However, we offer replacements or refunds in the following cases:
            </p>
            <ul>
              <li><strong>Damaged on Arrival:</strong> If your package is damaged during transit.</li>
              <li><strong>Wrong Item:</strong> If you received a product different from what you ordered.</li>
              <li><strong>Expired Product:</strong> If the product received is past its expiry date.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How to Request a Refund</h2>
            <p>
              To request a refund or replacement, please email us at <strong>support@northeaststore.in</strong> within 24 hours of receiving the product. Please include:
            </p>
            <ol>
              <li>Order Number</li>
              <li>Clear photos of the damaged/wrong product</li>
              <li>A brief description of the issue</li>
            </ol>
            <p>Our team will review your request and get back to you within 2 working days.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
