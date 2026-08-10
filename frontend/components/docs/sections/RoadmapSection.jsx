'use client';

import { motion } from 'framer-motion';
import { Milestone, Rocket, Shield, Globe, Zap, Users, Code } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const roadmapPhases = [
  {
    phase: 'Phase 1: Foundation (Completed)',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    items: [
      { title: 'Core Execution Engine', desc: 'Basic Docker-based code execution for Python and Node.js.' },
      { title: 'Queue Architecture', desc: 'Implementation of BullMQ and Redis to handle concurrent requests.' },
      { title: 'gVisor Integration', desc: 'User-space kernel isolation to prevent container escapes.' }
    ]
  },
  {
    phase: 'Phase 2: Platform Expansion (Current)',
    icon: Rocket,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    items: [
      { title: 'Multi-Language Support', desc: 'Adding native support for Go, Rust, C++, and Java execution.' },
      { title: 'Interactive WebSockets', desc: 'Upgrading from HTTP polling to real-time WebSocket streaming for stdout/stderr.' },
      { title: 'Database Persistence', desc: 'Storing execution history and user accounts in PostgreSQL via Prisma.' }
    ]
  },
  {
    phase: 'Phase 3: Scale & Enterprise (Upcoming)',
    icon: Globe,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    items: [
      { title: 'Global Edge Routing', desc: 'Deploying API Gateways to multiple AWS regions for lower global latency.' },
      { title: 'Private VPC Endpoints', desc: 'Allowing enterprise customers to securely connect their internal services to the execution environment.' },
      { title: 'Custom Language Images', desc: 'Allowing users to provide custom Dockerfiles with pre-installed dependencies.' }
    ]
  }
];

export default function RoadmapSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl  mt-22 lg:mt-0 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Development Roadmap</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          SecureCloud Run is an actively developed open-source project. Below is the strategic roadmap detailing our past achievements, current focus, and future enterprise goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
          <Zap className="text-yellow-400 mb-3" size={24} />
          <div className="text-2xl font-bold text-white mb-1">Q4 2026</div>
          <div className="text-sm text-gray-400">Target for Phase 2</div>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
          <Code className="text-blue-400 mb-3" size={24} />
          <div className="text-2xl font-bold text-white mb-1">6+</div>
          <div className="text-sm text-gray-400">Languages Planned</div>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
          <Users className="text-purple-400 mb-3" size={24} />
          <div className="text-2xl font-bold text-white mb-1">Open Source</div>
          <div className="text-sm text-gray-400">Community Driven</div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-8">
        {roadmapPhases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 md:p-8 rounded-2xl bg-[#0a0a0f] border ${phase.border} relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 ${phase.bg} blur-[60px] rounded-full pointer-events-none`} />

              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl bg-[#11111a] border ${phase.border}`}>
                  <Icon className={phase.color} size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{phase.phase}</h2>
              </div>

              <div className="space-y-6">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-white/30 mt-2" />
                      {i !== phase.items.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                    </div>
                    <div className="pb-4">
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
}
