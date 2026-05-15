'use client';

import React from 'react';
import styles from './faq.module.css';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: "Are your products truly authentic?",
      a: "Absolutely. We source directly from local farmers and artisans across all eight states of Northeast India. Each product is vetted for authenticity and traditional preparation methods."
    },
    {
      q: "How long does shipping take?",
      a: "Since we ship from the Northeast, standard delivery takes 5-7 business days to most metro cities in India. Remote locations may take up to 10 days."
    },
    {
      q: "Do you offer international shipping?",
      a: "Currently, we only ship within India. We are working on international logistics to bring the flavors of the Northeast to the world soon."
    },
    {
      q: "What is your return policy?",
      a: "Due to the perishable nature of food items, we only accept returns if the product is damaged or incorrect. Please contact us within 24 hours of delivery."
    },
    {
      q: "How can I track my order?",
      a: "Once your order is shipped, you will receive an email with the tracking number and a link to track your package in real-time."
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <HelpCircle size={48} className={styles.icon} />
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>Find quick answers to common queries about Northeast Store.</p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className={styles.question}>
                <span>{faq.q}</span>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {openIndex === index && (
                <div className={styles.answer}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
