'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StarLayer = ({ count, size, duration, direction, mousePosition, hasMoved, isMobile }) => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const newStars = [];
    // Significantly reduce star count on mobile to save GPU cycles
    const actualCount = isMobile ? Math.floor(count / 4) : count;
    for (let i = 0; i < actualCount; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    setStars(newStars);
  }, [count, isMobile]);

  // Disable parallax calculation entirely on mobile
  const parallaxX = (hasMoved && !isMobile && typeof window !== 'undefined') ? (mousePosition.x - window.innerWidth / 2) * (size * 0.02) : 0;
  const parallaxY = (hasMoved && !isMobile && typeof window !== 'undefined') ? (mousePosition.y - window.innerHeight / 2) * (size * 0.02) : 0;

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-0"
      animate={{ x: parallaxX, y: parallaxY }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
      style={{ willChange: 'transform' }}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] min-h-[150vw] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: direction === 'cw' ? 360 : -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
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
              // Box shadow removed. Box-shadows on hundreds of nodes destroy mobile frame rates.
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
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent initial lag spike on phones

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't track mouse events on mobile
    const handleMouseMove = (e) => {
      if (!hasMoved) setHasMoved(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMoved, isMobile]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#030308]">
      {/* Cosmic Nebula Cores */}
      {/* Removed "scale" animation on blurs. Scaling massive blurred divs forces constant GPU repaints on mobile. */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'opacity' }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ willChange: 'opacity' }}
      />

      {/* 3D Rotating Galaxy Star Layers with Parallax */}
      <StarLayer count={250} size={1} duration={240} direction="cw" mousePosition={mousePosition} hasMoved={hasMoved} isMobile={isMobile} />
      <StarLayer count={120} size={2} duration={320} direction="ccw" mousePosition={mousePosition} hasMoved={hasMoved} isMobile={isMobile} />
      <StarLayer count={50} size={3} duration={180} direction="cw" mousePosition={mousePosition} hasMoved={hasMoved} isMobile={isMobile} />
    </div>
  );
}
