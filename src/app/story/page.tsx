'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mountain, HeartHandshake, Leaf, ShoppingBag } from 'lucide-react';
import styles from './story.module.css';

const states = [
  { name: 'Arunachal Pradesh', trait: 'Land of Dawn-lit Mountains', color: '#2d6a4f' },
  { name: 'Assam', trait: 'Land of Red River and Blue Hills', color: '#d4a373' },
  { name: 'Manipur', trait: 'Jewel of India', color: '#386641' },
  { name: 'Meghalaya', trait: 'Abode of Clouds', color: '#52796f' },
  { name: 'Mizoram', trait: 'Land of the Highlanders', color: '#e9c46a' },
  { name: 'Nagaland', trait: 'Land of Festivals', color: '#bc4749' },
  { name: 'Sikkim', trait: 'First Organic State of India', color: '#9d0208' },
  { name: 'Tripura', trait: 'Cultural Heartland', color: '#f2e8cf' },
];

export default function StoryPage() {
  return (
    <div className={styles.storyPage}>
      {/* Hero Section */}
      <section className={styles.storyHero}>
        <div className={`container ${styles.heroContainer}`}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            NortheastStore.in
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A digital bridge connecting you to the authentic, organic, and culturally rich food products of the eight states of Northeast India.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.grid}`}>
          <motion.div 
            className={styles.textContent}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>What We Do</h2>
            <p>
              Northeast India is home to a rich and diverse food culture, with a wide variety of traditional, handcrafted, and organic products that carry the essence of the region&apos;s heritage. However, many of these authentic products remain largely inaccessible to the broader Indian market.
            </p>
            <p>
              <strong>NortheastStore.in</strong> solves this problem by providing a centralized, user-friendly online store. Whether it&apos;s Assam&apos;s organic black rice, Naga King Chili, Sikkim&apos;s cardamom, Manipur&apos;s fermented fish, or Meghalaya&apos;s lakadong turmeric—we bring these unique regional flavors directly to you.
            </p>
            
            <h2 style={{ marginTop: '3rem' }}>Our Mission</h2>
            <ul className={styles.missionList}>
              <li>
                <span className={styles.missionIcon}><Mountain size={32} color="var(--color-primary)" strokeWidth={1.5} /></span>
                <div>
                  <strong>Cultural Promotion</strong>
                  <p>Preserving the unique food culture and heritage of Northeast India.</p>
                </div>
              </li>
              <li>
                <span className={styles.missionIcon}><HeartHandshake size={32} color="var(--color-primary)" strokeWidth={1.5} /></span>
                <div>
                  <strong>Community Support</strong>
                  <p>Empowering local farmers, artisans, and small businesses.</p>
                </div>
              </li>
              <li>
                <span className={styles.missionIcon}><Leaf size={32} color="var(--color-primary)" strokeWidth={1.5} /></span>
                <div>
                  <strong>Authentic Access</strong>
                  <p>Providing genuine, high-quality organic and traditional products.</p>
                </div>
              </li>
              <li>
                <span className={styles.missionIcon}><ShoppingBag size={32} color="var(--color-primary)" strokeWidth={1.5} /></span>
                <div>
                  <strong>Seamless Experience</strong>
                  <p>Delivering a smooth online shopping experience for regional goods.</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <div className={styles.imageGrid}>
            <motion.div 
              className={styles.imageWrapper}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image 
                src="/story_hero.png" 
                alt="Northeast Indian tribal culture and organic farming" 
                fill
                className={styles.image}
              />
            </motion.div>
            <motion.div 
              className={`${styles.imageWrapper} ${styles.imageWrapperOffset}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Image 
                src="/turmeric.png" 
                alt="Organic farming and products" 
                fill
                className={styles.image}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The States */}
      <section className={styles.sistersSection}>
        <div className="container">
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet the 8 States
          </motion.h2>
          <div className={styles.sistersList}>
            {states.map((state, index) => (
              <motion.div 
                key={index} 
                className={styles.sisterCard} 
                style={{ borderTop: `4px solid ${state.color}` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              >
                <h3>{state.name}</h3>
                <p>{state.trait}</p>
                <div className={styles.cardBg} style={{ backgroundColor: state.color }}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
