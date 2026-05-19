'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Leaf {
  id: number;
  x: number;
  endX: number; // ✅ Fix 6: pre-calculated end position
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export default function LeafEffect() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generatedLeaves = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      endX: Math.random() * 100 + (Math.random() * 10 - 5), // ✅ Fix 6: calculated once here
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 15 + Math.random() * 20,
      rotation: Math.random() * 360,
    }));
    setLeaves(generatedLeaves);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {leaves.map((leaf, i) => (
        <motion.div
          key={leaf.id}
          initial={{ 
            top: -50, 
            left: `${leaf.x}%`, 
            rotate: leaf.rotation,
            opacity: 0,
          }}
          animate={{ 
            top: '110%', 
            left: `${leaf.endX}%`,  // ✅ Fix 6: static value, not recalculated every frame
            rotate: leaf.rotation + 360,
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{ 
            duration: leaf.duration, 
            delay: leaf.delay, 
            repeat: Infinity, 
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: leaf.size,
            height: leaf.size,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.1))',
            zIndex: 1,
          }}
        >
          <svg viewBox="0 0 24 24" fill={['#2d5a27', '#4a7c44', '#1e3d1a', '#d4af37'][i % 4]} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 3 10 3 15C3 19.97 7.03 24 12 24C16.97 24 21 19.97 21 15C21 10 12 2 12 2ZM12 22C8.13 22 5 18.87 5 15C5 12.5 8.5 7.5 12 3.8C15.5 7.5 19 12.5 19 15C19 18.87 15.87 22 12 22Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}