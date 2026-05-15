import React from 'react';
import styles from './payment.module.css';
import { CreditCard, Smartphone, CheckCircle } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Secure Payments</h1>
          <p className={styles.subtitle}>Choose your preferred way to pay.</p>
        </div>
      </header>

      <main className="container py-16">
        <div className={styles.grid}>
          <div className={styles.card}>
            <CreditCard size={40} className={styles.icon} />
            <h3>Debit & Credit Cards</h3>
            <p>We accept all major Visa, Mastercard, and Rupay cards issued in India and internationally.</p>
            <span className={styles.badge}>Secure via Razorpay</span>
          </div>

          <div className={styles.card}>
            <Smartphone size={40} className={styles.icon} />
            <h3>UPI & Wallets</h3>
            <p>Pay instantly using GPay, PhonePe, Paytm, or any UPI app for a seamless checkout experience.</p>
            <span className={styles.badge}>Instant Verification</span>
          </div>

          <div className={styles.card}>
            <CheckCircle size={40} className={styles.icon} />
            <h3>Net Banking</h3>
            <p>Secure direct bank transfers from over 50+ major banks across India.</p>
            <span className={styles.badge}>Safe & Encrypted</span>
          </div>
        </div>

        <div className={styles.securityInfo}>
          <h2>Why pay with us?</h2>
          <p>
            Your payment security is our top priority. We use industry-standard SSL encryption and partner with leading payment gateways to ensure your transactions are 100% safe.
          </p>
        </div>
      </main>
    </div>
  );
}
