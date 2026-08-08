'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Monitor, Network, Database, Cpu, Box, TerminalSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const architectureLayers = [
  {
    id: 'browser',
    name: 'Browser / Client',
    icon: Monitor,
    color: 'text-blue-400',
    border: 'from-blue-500',
    glow: 'bg-blue-500/20',
    desc: 'This is where users use the website. It displays the interface, takes user input, and sends requests to the server.'
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    icon: Network,
    color: 'text-cyan-400',
    border: 'from-cyan-500',
    glow: 'bg-cyan-500/20',
    desc: 'Receives all requests from users, checks if they are valid, and forwards them to the correct service.'
  },
  {
    id: 'queue',
    name: 'Redis Queue',
    icon: Database,
    color: 'text-red-400',
    border: 'from-red-500',
    glow: 'bg-red-500/20',
    desc: 'Stores code execution requests in a queue so they can be processed one by one without overloading the system.'
  },
  {
    id: 'worker',
    name: 'Worker Pool',
    icon: Cpu,
    color: 'text-emerald-400',
    border: 'from-emerald-500',
    glow: 'bg-emerald-500/20',
    desc: 'Workers pick up code from the queue and prepare a safe environment to run it.'
  },
  {
    id: 'sandbox',
    name: 'Docker + gVisor Sandbox',
    icon: Box,
    color: 'text-purple-400',
    border: 'from-purple-500',
    glow: 'bg-purple-500/20',
    desc: 'The code runs inside a secure, isolated container so it cannot affect the main server or other users.'
  },
  {
    id: 'result',
    name: 'Execution Result',
    icon: TerminalSquare,
    color: 'text-green-400',
    border: 'from-green-500',
    glow: 'bg-green-500/20',
    desc: 'The output, errors, and execution details are sent back to the user and shown instantly on the screen.'
  }
];

export default function Architecture() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Select all nodes and arrows
    const nodes = gsap.utils.toArray('.arch-node');
    const arrows = gsap.utils.toArray('.arch-arrow');
    const descs = gsap.utils.toArray('.arch-desc');

    // Animate nodes and arrows individually with their own ScrollTriggers
    nodes.forEach((node, index) => {
      const desc = descs[index];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top 85%', // Trigger exactly when the node reaches 85% down the screen
          toggleActions: 'play reverse play reverse', // Play on scroll down, Reverse on scroll up
        }
      });

      // Reveal node smoothly
      tl.fromTo(node,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );

      // Reveal description smoothly
      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, x: index % 2 === 0 ? 30 : -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          "<0.1"
        );
      }

      // If there is an arrow after this node, reveal it and animate the path
      if (arrows[index]) {
        const path = arrows[index].querySelector('.anim-path');
        const chevron = arrows[index].querySelector('.anim-chevron');
        if (path && chevron) {
          const length = path.getTotalLength();

          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.set(chevron, { opacity: 0, y: -10 });

          tl.fromTo(arrows[index], { opacity: 0 }, { opacity: 1, duration: 0.2 }, "-=0.4")
            .to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, "-=0.2")
            .to(chevron, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }, "-=0.3");
        }
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 pt-60 relative overflow-hidden bg-transparent font-mono">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl mb-2 text-text font-sans">
            System <span className="text-gradient tracking-tighter">Architecture</span>
          </h2>
          <p className="text-muted text-lg font-sans">
            A high-performance, secure, and distributed execution pipeline.
          </p>
        </div>

        <div className="flex flex-col items-center">
          {architectureLayers.map((layer, index) => (
            <div key={layer.id} className="flex flex-col items-center w-full relative">

              {/* Architecture Wrapper */}
              <div className="relative flex justify-center w-full max-w-5xl">

                {/* Zigzag Description */}
                <div className={`arch-desc hidden lg:flex flex-col justify-center absolute top-0 bottom-0 w-[280px] xl:w-[320px] ${index % 2 === 0 ? 'right-[calc(50%+15rem)] text-right items-end' : 'left-[calc(50%+15rem)] text-left items-start'}`}>
                  <div className={`text-xs font-bold tracking-widest uppercase mb-3 mt-1 ${layer.color} opacity-80`}>
                    Step 0{index + 1}
                  </div>

                  <p className="text-muted leading-relaxed text-sm">
                    {layer.desc}
                  </p>
                </div>

                {/* Architecture Node */}
                <div className="arch-node w-full max-w-sm relative group cursor-pointer z-10">

                  {/* Subtle border highlight on hover instead of high contrast glow */}
                  <div className={`absolute -inset-[1px] rounded-xl bg-gradient-to-br ${layer.border} to-transparent opacity-10 group-hover:opacity-30 transition-all duration-500`} />

                  {/* Main Box */}
                  <div className={`relative w-full p-6 rounded-xl border border-white/5 bg-[#050508]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]`}>

                    {/* Tech Blueprint Accents (Expanding on hover) */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-white/40" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 rounded-tr transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-white/40" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 rounded-bl transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:border-white/40" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 rounded-br transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:border-white/40" />

                    <div className={`relative p-3 rounded-lg bg-black/60 border border-white/5 mb-4 ${layer.color} transition-all duration-500 group-hover:scale-110 z-10`}>
                      <layer.icon size={28} />
                    </div>

                    <div className="relative z-10">
                      <h3 className={`text-lg font-bold tracking-wider text-white transition-colors duration-300 group-hover:${layer.color}`}>
                        {layer.name}
                      </h3>
                      <div className="text-[10px] text-muted/50 uppercase tracking-[0.3em] mt-2 group-hover:text-muted transition-colors duration-300">
                        Layer 0{index + 1}
                      </div>
                    </div>

                    <div className={`absolute top-4 right-4 text-[10px] font-bold tracking-widest ${layer.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse`}>
                      ● ACTIVE
                    </div>
                  </div>
                </div>

              </div>

              {/* Connecting Arrow */}
              {index < architectureLayers.length - 1 && (
                <div className="arch-arrow h-32 w-8 relative flex justify-center">
                  <svg width="24" height="128" viewBox="0 0 24 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0">
                    <path
                      d="M12 0L12 128"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M12 0L12 128"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary anim-path"
                    />
                    <path
                      d="M6 60L12 68L18 60"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary anim-chevron"
                    />
                  </svg>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
