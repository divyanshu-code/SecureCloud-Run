'use client';

import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-danger/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-danger/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="mb-8 relative inline-block"
        >
          <h1 className="text-9xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
            404
          </h1>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-danger/20"
          >
            <Compass size={180} strokeWidth={1} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Lost in Cyberspace
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed max-w-lg mx-auto">
            The execution node you're looking for doesn't exist or has been terminated. Let's get you back to safety.
          </p>

          <Button 
            href="/" 
            variant="primary" 
            size="lg" 
            icon={Home} 
            iconPosition="left"
            className="shadow-glow-primary"
          >
            Return to Base
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
