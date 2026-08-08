'use client';

import { motion } from 'framer-motion';
import { Box, Shield, Layers, Database, Code, Zap } from 'lucide-react';

const features = [
  {
    icon: Box,
    title: 'Docker Isolation',
    description: 'Each execution runs within an isolated Docker container, ensuring a clean and consistent environment for every snippet of code.',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Shield,
    title: 'gVisor Security',
    description: 'Leveraging gVisor to provide an extra layer of defense, restricting container syscalls and isolating workloads against zero-day threats.',
    gradient: 'from-purple-500 to-indigo-400'
  },
  {
    icon: Layers,
    title: 'Distributed Workers',
    description: 'Scale infinitely with a robust distributed worker pool architecture capable of handling thousands of concurrent executions.',
    gradient: 'from-emerald-500 to-teal-400'
  },
  {
    icon: Database,
    title: 'Redis Queue',
    description: 'High-performance message brokering and task queuing powered by Redis and BullMQ for reliable job execution and retries.',
    gradient: 'from-red-500 to-orange-400'
  },
  {
    icon: Code,
    title: 'Multi Language Support',
    description: 'First-class support for Python, JavaScript, Go, C++, Rust, and more, all with customizable runtimes and dependency injection.',
    gradient: 'from-yellow-500 to-amber-400'
  },
  {
    icon: Zap,
    title: 'Real-time Output',
    description: 'Stream execution output, logs, and errors back to the client in real-time with ultra-low latency WebSocket connections.',
    gradient: 'from-pink-500 to-rose-400'
  }
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section className="py-24 pt-50  relative overflow-hidden bg-transparent">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl mb-2 text-text"
          >
            Engineered for <span className="text-gradient tracking-tighter">Scale & Security</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted text-lg"
          >
            The ultimate infrastructure for safe, fast, and distributed code execution. Built with the same technologies that power modern cloud providers.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
            >
              {/* Animated Gradient Border Layer */}
              <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-br from-white/10 to-transparent opacity-100 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.01]" />

              {/* Dynamic Hover Gradient Border */}
              <div className={`absolute -inset-[1px] rounded-lg bg-gradient-to-br ${feature.gradient} opacity-0 blur-sm transition-all duration-500 group-hover:opacity-40 group-hover:scale-[1.01]`} />
              <div className={`absolute -inset-[1px] rounded-lg bg-gradient-to-br ${feature.gradient} opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.01]`} />

              {/* Card Content Layer */}
              <div className="relative h-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-lg p-8 border border-transparent transition-all duration-500 group-hover:scale-[1.01] overflow-hidden">

                {/* Internal Hover Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-[40px] transition-all duration-500`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 transition-colors duration-500 group-hover:bg-transparent group-hover:border-transparent relative`}>

                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-all duration-500`} />
                    <feature.icon className={`w-7 h-7 text-white transition-all duration-500`} />
                  </div>

                  <h3 className="text-xl font-bold text-text mb-3 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-muted leading-relaxed flex-grow group-hover:text-muted/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
