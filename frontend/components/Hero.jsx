"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Globe, Server, Database, Settings, Shield, Terminal, ArrowRight, Play } from 'lucide-react';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

const architectureSteps = [
  { id: 'browser', name: 'Browser', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'api', name: 'API Gateway', icon: Server, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'queue', name: 'Redis + BullMQ', icon: Database, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 'workers', name: 'Worker Pools', icon: Settings, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { id: 'sandbox', name: 'Docker + gVisor', icon: Shield, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'output', name: 'Secure Output', icon: Terminal, color: 'text-gray-300', bg: 'bg-gray-300/10' },
];

const nodePositionsDesktop = [
  { top: '5%', left: '10%' },
  { top: '23%', left: '30%' },
  { top: '41%', left: '50%' },
  { top: '59%', left: '70%' },
  { top: '77%', left: '90%' },
  { top: '95%', left: '60%' },
];

const nodePositionsMobile = [
  { top: '5%', left: '20%' },
  { top: '23%', left: '80%' },
  { top: '41%', left: '20%' },
  { top: '59%', left: '80%' },
  { top: '77%', left: '20%' },
  { top: '95%', left: '60%' },
];

export default function Hero() {
  const isShowcaseMode = process.env.NEXT_PUBLIC_SHOWCASE_MODE === 'true';
  const [activeStep, setActiveStep] = useState(-1);
  const [reachedStep, setReachedStep] = useState(-1);
  const [demoText, setDemoText] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const nodePositions = isMobile ? nodePositionsMobile : nodePositionsDesktop;

  const handleMouseMove = (e) => {
    if (!hasMoved) setHasMoved(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    let mounted = true;
    const runSequence = async () => {
      const fullText = "$ executing sandbox...\n> connection secure.\n> result: Success (42ms)";

      while (mounted) {
        setIsResetting(true);
        setActiveStep(-1);
        setReachedStep(-1);
        setDemoText('');
        await new Promise(r => setTimeout(r, 50)); // let React snap dot back instantly
        if (!mounted) return;
        setIsResetting(false);

        await new Promise(r => setTimeout(r, 600));
        if (!mounted) return;

        // Step through nodes continuously (no pauses between them)
        for (let i = 0; i <= architectureSteps.length; i++) {
          setActiveStep(i);
          await new Promise(r => setTimeout(r, 1500)); // Time for dot to travel
          if (!mounted) return;

          if (i < architectureSteps.length) {
            setReachedStep(i); // Dot has arrived! Light up icon.
          } else {
            // Dot reached the end and moves offscreen. Run the demo text typing effect!
            for (let j = 1; j <= fullText.length; j++) {
              await new Promise(r => setTimeout(r, 20));
              if (!mounted) return;
              setDemoText(fullText.substring(0, j));
            }
            // Hold to read the text before resetting
            await new Promise(r => setTimeout(r, 3000));
          }
        }
      }
    };
    runSequence();
    return () => { mounted = false; };
  }, []);

  const getPos = (i) => {
    if (i === -1) return { top: '-10%', left: nodePositions[0].left }; // off-screen start
    if (i < architectureSteps.length) return nodePositions[i] || nodePositions[0];
    return { top: '110%', left: nodePositions[5].left }; // off-screen exit
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section
      className="relative overflow-hidden pt-32 pb-16  lg:pb-24 flex items-center min-h-[calc(100vh-4rem)]"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Mouse Glow Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 hidden lg:block"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56,189,248,0.08), transparent 60%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-20 items-center">

          {/* Left Column - Text Content */}
          <motion.div
            className="lg:col-span-6 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center lg:mt-30 mt-20 gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-6 text-sm text-accent font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              v1.0 Now Live
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight mb-6 leading-[1.1]">
              Run Code Securely at <span className="text-gradient-shine">Cloud Scale.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A distributed code execution platform powered by Docker, gVisor, Redis, BullMQ, and Worker Pools.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center mb-40 lg:justify-start gap-4">
              {isShowcaseMode ? (
                <Button variant="primary" size="lg" icon={Play} iconPosition="left" className="w-full sm:w-auto shadow-glow-primary" onClick={() => toast('This page requires login, which is disabled in Showcase Mode.', { icon: '' })}>
                  Try Playground
                </Button>
              ) : (
                <Button variant="primary" size="lg" icon={Play} iconPosition="left" className="w-full sm:w-auto shadow-glow-primary" href="/playground">
                  Try Playground
                </Button>
              )}
              <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto group" href="/architecture">
                View Architecture
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Architecture */}
          <motion.div
            className="lg:col-span-6 relative mb-16 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="relative min-h-[550px] lg:min-h-[600px] w-full">

              {/* SVG Background Track */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Initial drop line from top into first node */}
                <line x1={nodePositions[0].left} y1="-10%" x2={nodePositions[0].left} y2={nodePositions[0].top} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

                {nodePositions.slice(0, -1).map((pos, i) => {
                  const next = nodePositions[i + 1];
                  const yMid = (parseFloat(pos.top) + parseFloat(next.top)) / 2 + '%';
                  return (
                    <g key={i}>
                      {/* Down */}
                      <line x1={pos.left} y1={pos.top} x2={pos.left} y2={yMid} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Right */}
                      <line x1={pos.left} y1={yMid} x2={next.left} y2={yMid} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                      {/* Down */}
                      <line x1={next.left} y1={yMid} x2={next.left} y2={next.top} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                    </g>
                  );
                })}
              </svg>

              {/* Moving Dot Head */}
              <motion.div
                className="absolute w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_#38BDF8] z-20"
                style={{ transform: 'translate(-6px, -6px)' }}
                animate={isResetting ? {
                  top: getPos(-1).top,
                  left: getPos(-1).left,
                  opacity: 0
                } : activeStep === -1 ? {
                  top: getPos(-1).top,
                  left: getPos(-1).left,
                  opacity: 1
                } : {
                  top: [
                    getPos(activeStep - 1).top,
                    (parseFloat(getPos(activeStep - 1).top) + parseFloat(getPos(activeStep).top)) / 2 + '%',
                    (parseFloat(getPos(activeStep - 1).top) + parseFloat(getPos(activeStep).top)) / 2 + '%',
                    getPos(activeStep).top
                  ],
                  left: [
                    getPos(activeStep - 1).left,
                    getPos(activeStep - 1).left,
                    getPos(activeStep).left,
                    getPos(activeStep).left
                  ],
                  opacity: 1
                }}
                transition={{ duration: isResetting ? 0 : 1.5, times: [0, 0.33, 0.66, 1], ease: "linear" }}
              />

              {architectureSteps.map((step, index) => {
                const isPast = reachedStep > index;
                const isCurrent = reachedStep === index;
                const isActive = isCurrent || isPast;

                return (
                  <div
                    key={step.id}
                    className="absolute z-10 flex items-center transition-all duration-500 group cursor-pointer"
                    style={{
                      top: nodePositions[index].top,
                      left: nodePositions[index].left,
                      transform: 'translate(-24px, -24px)'
                    }}
                  >
                    {/* The Icon */}
                    <div className="relative">
                      <div className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:opacity-100 group-hover:grayscale-0 ${isActive ? step.bg : 'bg-transparent border border-white/5 grayscale opacity-30 group-hover:border-white/20 group-hover:bg-white/5'} ${isActive ? step.color : 'text-white group-hover:text-white'} ${isCurrent ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}`}>
                        <step.icon size={24} />
                      </div>

                      {/* Current Pulse */}
                      {isCurrent && (
                        <motion.div
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${step.bg.replace('/10', '')}`}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* The Name (Hidden until active, shown on hover) */}
                    <div className={`absolute ${index % 2 === 0 ? 'left-[65px]' : 'right-[65px]'} whitespace-nowrap font-semibold tracking-wide transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0 ${isActive ? 'opacity-100 translate-x-0' : `opacity-0 pointer-events-none ${index % 2 === 0 ? '-translate-x-4' : 'translate-x-4'}`} ${isCurrent ? 'text-text' : 'text-text/70 group-hover:text-text'}`}>
                      {step.name}
                    </div>

                    {/* Demo Output Box for the final step */}
                    {step.id === 'output' && (
                      <div className={`absolute top-1/2 -translate-y-1/2 left-[130%] w-[240px] bg-[#0a0a0a]/90 rounded-md p-3 border border-white/10 font-mono text-xs text-green-400 whitespace-pre-wrap shadow-lg backdrop-blur-md transition-all duration-500 overflow-hidden ${demoText ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                        {demoText}
                        <span className="animate-pulse">_</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
