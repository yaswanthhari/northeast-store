'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Seed {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
}

export default function DandelionEffect() {
  const [dandelions, setDandelions] = useState<Seed[]>([]);

  useEffect(() => {
    // Generate random dandelion seeds only on client side to avoid hydration mismatch
    const seeds = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      startX: 110 + Math.random() * 50, // Start off-screen right
      endX: -20 - Math.random() * 50, // End off-screen left
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 0.6 + Math.random() * 0.8,
    }));
    setDandelions(seeds);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {dandelions.map((seed) => (
        <motion.div
          key={seed.id}
          initial={{ y: '-20%', x: `${seed.startX}vw`, opacity: 0, rotate: 0 }}
          animate={{ 
            y: ['-20%', '120%'], 
            x: [`${seed.startX}vw`, `${seed.endX}vw`],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: seed.duration, 
            repeat: Infinity, 
            delay: seed.delay,
            ease: "linear"
          }}
          style={{ position: 'absolute', top: 0, scale: seed.size }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))' }}>
             <path d="M12 12V22" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M12 12L7 4" stroke="#eadd9a" strokeWidth="1.2" strokeLinecap="round"/>
             <path d="M12 12L9 2" stroke="#eadd9a" strokeWidth="1.2" strokeLinecap="round"/>
             <path d="M12 12L12 0" stroke="#eadd9a" strokeWidth="1.2" strokeLinecap="round"/>
             <path d="M12 12L15 2" stroke="#eadd9a" strokeWidth="1.2" strokeLinecap="round"/>
             <path d="M12 12L17 4" stroke="#eadd9a" strokeWidth="1.2" strokeLinecap="round"/>
             <circle cx="7" cy="4" r="2" fill="#ffffff"/>
             <circle cx="9" cy="2" r="2" fill="#ffffff"/>
             <circle cx="12" cy="0" r="2" fill="#ffffff"/>
             <circle cx="15" cy="2" r="2" fill="#ffffff"/>
             <circle cx="17" cy="4" r="2" fill="#ffffff"/>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
