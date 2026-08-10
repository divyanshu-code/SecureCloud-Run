'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, ArrowLeft, Sparkles } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';

export default function CareerPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SpaceBackground />

      {/* Dynamic glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px] opacity-50 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 max-w-3xl w-full mx-auto text-center">

        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-semibold text-accent tracking-wide uppercase">We're building the future</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-6 tracking-tighter"
        >
          Careers
          <span className="block mt-2 text-3xl md:text-5xl font-extrabold bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-purple-500">Coming Soon</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We are preparing to scale the engineering team behind SecureCloud Run. Opportunities to work on distributed systems, sandboxed execution, and hyper-scale architecture are on the way!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white rounded-xl font-medium transition-all w-full sm:w-auto"
            >
              <ArrowLeft size={18} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </motion.button>
          </Link>

          <Link href="https://github.com/divyanshu-code/SecureCloud-Run" target="_blank">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-accent/90 hover:bg-accent text-white rounded-xl font-semibold transition-all shadow-[0_0_40px_rgba(var(--accent-color),0.3)] w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                Star on GitHub
                <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
