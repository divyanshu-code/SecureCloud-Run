import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { CheckCircle2, XCircle, Clock, Loader2, Play } from 'lucide-react';
import { useExecutionStore } from '@/src/store/execution.store';

const steps = [
  { id: 'queued', label: 'Waiting in Queue' },
  { id: 'running', label: 'Running' },
];

export default function ExecutionStatus() {
  const { executionStatus } = useExecutionStore();
  const progressBarRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if ((executionStatus === 'queued' || executionStatus === 'running') && progressBarRef.current && glowRef.current) {
      // GSAP subtle progress animation (indeterminate)
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(progressBarRef.current, {
        x: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
      }).set(progressBarRef.current, {
        x: '-100%',
      });

      // GSAP Glow Pulse
      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.1,
        duration: 1,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      
      return () => {
        tl.kill();
        gsap.killTweensOf(glowRef.current);
      };
    }
  }, [executionStatus]);

  if (executionStatus === 'idle') return null;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto space-y-6">
      
      {/* Dynamic Status Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div ref={glowRef} className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0" />
        <div className="relative w-16 h-16 rounded-full bg-[#111318] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
          {executionStatus === 'queued' && <Clock size={28} className="text-yellow-400" />}
          {executionStatus === 'running' && <Loader2 size={28} className="text-primary animate-spin" />}
          {executionStatus === 'completed' && <CheckCircle2 size={28} className="text-green-400" />}
          {executionStatus === 'failed' && <XCircle size={28} className="text-red-400" />}
        </div>
      </motion.div>

      {/* Status Text & Step Progress */}
      <div className="flex flex-col items-center w-full space-y-4">
        
        {/* Step Indicators */}
        {(executionStatus === 'queued' || executionStatus === 'running') && (
          <div className="flex items-center space-x-3 w-full justify-center">
            {steps.map((step, index) => {
              const isActive = executionStatus === step.id || (executionStatus === 'running' && step.id === 'queued');
              const isCurrent = executionStatus === step.id;
              return (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isActive ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]' : 'bg-white/10'}`} />
                    <span className={`text-sm font-medium transition-colors duration-500 ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px transition-colors duration-500 ${isActive ? 'bg-primary/50' : 'bg-white/10'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* GSAP Progress Bar */}
        {(executionStatus === 'queued' || executionStatus === 'running') && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative mt-2">
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-75"
              style={{ transform: 'translateX(-100%)' }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
