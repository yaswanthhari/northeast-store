'use client';

import React from 'react';
import styles from './contact.module.css';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

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
                <p>northeaststore.in@gmail.com</p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <Phone size={24} />
              </div>
              <div>
                <h3>Call Us</h3>
                <p>+91 93911 69152</p>
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                required
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea 
                required
                placeholder="How can we help you?" 
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={status === 'sending'}
            >
              <Send size={20} />
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <p className={styles.successMsg}>Message sent successfully!</p>}
            {status === 'error' && <p className={styles.errorMsg}>Failed to send message. Please try again.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
