'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StarLayer = ({ count, size, duration, direction, mousePosition, hasMoved }) => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    setStars(newStars);
  }, [count]);

  const parallaxX = hasMoved && typeof window !== 'undefined' ? (mousePosition.x - window.innerWidth / 2) * (size * 0.02) : 0;
  const parallaxY = hasMoved && typeof window !== 'undefined' ? (mousePosition.y - window.innerHeight / 2) * (size * 0.02) : 0;

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-0"
      animate={{ x: parallaxX, y: parallaxY }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-h-[150vw] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: direction === 'cw' ? 360 : -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: size,
              height: size,
              opacity: star.opacity,
              boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.6)`
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default function SpaceBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!hasMoved) setHasMoved(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMoved]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#030308]">
      {/* Cosmic Nebula Cores */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" 
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* 3D Rotating Galaxy Star Layers with Parallax */}
      <StarLayer count={250} size={1} duration={240} direction="cw" mousePosition={mousePosition} hasMoved={hasMoved} />
      <StarLayer count={120} size={2} duration={320} direction="ccw" mousePosition={mousePosition} hasMoved={hasMoved} />
      <StarLayer count={50} size={3} duration={180} direction="cw" mousePosition={mousePosition} hasMoved={hasMoved} />
    </div>
  );
}
