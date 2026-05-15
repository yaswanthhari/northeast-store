import React from 'react';
import styles from './delivery.module.css';

export default function DeliveryPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Delivery Information</h1>
          <p className={styles.subtitle}>Bridging the distance between the Northeast and your doorstep.</p>
        </div>
      </header>

      <main className="container py-16">
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Shipping Coverage</h2>
            <p>
              We deliver to over 26,000 pin codes across India. Whether you are in a metro city or a remote town, we strive to bring the authentic flavors of the Northeast to you.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Delivery Timelines</h2>
            <p>
              Since we source products directly from the eight states of Northeast India, shipping times may vary:
            </p>
            <ul>
              <li><strong>Metro Cities:</strong> 5-7 working days.</li>
              <li><strong>Other Cities:</strong> 7-10 working days.</li>
              <li><strong>Remote Areas:</strong> 10-12 working days.</li>
            </ul>
            <p><em>*Note: Certain items like Smoked Meats are prepared fresh on order and may take an additional 2-3 days.</em></p>
          </section>

          <section className={styles.section}>
            <h2>Shipping Charges</h2>
            <p>
              We offer flat-rate shipping based on your order weight. Orders above ₹2,000 qualify for <strong>FREE SHIPPING</strong> across India.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive a tracking link via email and SMS. You can also track your order directly through our website under the "Order History" section.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
