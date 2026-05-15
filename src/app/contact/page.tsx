'use client';

import React from 'react';
import styles from './contact.module.css';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>Have questions about our authentic Northeast treasures? We're here to help.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.glassCard}>
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <Mail size={24} />
              </div>
              <div>
                <h3>Email Us</h3>
                <p>support@northeaststore.in</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <Phone size={24} />
              </div>
              <div>
                <h3>Call Us</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <MapPin size={24} />
              </div>
              <div>
                <h3>Visit Us</h3>
                <p>Eight States Building, Guwahati, Assam - 781001</p>
              </div>
            </div>
          </div>

          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea placeholder="How can we help you?" rows={5}></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
