'use client';

import { motion } from 'framer-motion';
import { Database, Server, Box, Layers, Triangle, CheckCircle, XCircle, Shield } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const techStack = [
  {
    name: 'Redis + BullMQ',
    icon: Database,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    purpose: 'Acts as the central nervous system, managing the job queue for code executions.',
    why: 'Redis is used because it can store and retrieve requests very quickly. BullMQ uses Redis to create a reliable job queue, ensuring requests are processed in order, failed jobs can be retried automatically, and workers always have the next job ready to execute.',
    alternatives: [
      { name: 'RabbitMQ', pros: 'Excellent routing and durability.', cons: 'Heavier, higher latency.' },
      { name: 'Apache Kafka', pros: 'Unbeatable throughput for event streaming.', cons: 'Overkill for a simple FIFO task queue; complex ZooKeeper/KRaft setup.' }
    ]
  },
  {
    name: 'Node.js (API & Workers)',
    icon: Server,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    purpose: 'Powers both the API Gateway routing and the Worker Pool orchestration.',
    why: 'Node.js is used throughout the backend because it handles many tasks efficiently without blocking other requests. The API Gateway uses it to receive requests and communicate with Redis, while the workers use it to create Docker containers, run user code, collect the output, and send the results back to the user.',
    alternatives: [
      { name: 'Golang', pros: 'True multithreading, incredibly fast.', cons: 'Longer development cycle for writing complex orchestration logic compared to JS/TS.' },
      { name: 'Python (FastAPI)', pros: 'FastAPI provides a great development experience and a strong ecosystem.', cons: 'Python\'s Global Interpreter Lock(GIL) can limit performance in applications that need to handle many real- time tasks simultaneously, such as WebSocket communication and code execution services.' }
    ]
  },
  {
    name: 'Docker',
    icon: Box,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    purpose: 'Containerizes the user code execution environment.',
    why: 'Docker allows us to pull pre-built language runtimes (e.g., `python:3.11-alpine`) instantly. It provides cgroups (control groups) out of the box, allowing us to strictly limit the RAM and CPU available to a user script so they cannot perform denial-of-service (DoS) attacks on the worker node.',
    alternatives: [
      { name: 'Firecracker MicroVMs', pros: 'Extreme security, hardware-level isolation.', cons: 'Slower boot times than containers, very complex to orchestrate.' },
      { name: 'WASM (WebAssembly)', pros: 'Instant startup, highly secure.', cons: 'Cannot run arbitrary system-level Python or Go code; limited standard library support.' }
    ]
  },
  {
    name: 'gVisor',
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    purpose: 'A user-space kernel acting as a security boundary between Docker and the host.',
    why: 'Docker by default shares the host Linux kernel. If a user discovers a zero-day kernel exploit, they can break out of the Docker container and take over the underlying AWS EC2 instance. gVisor intercepts all system calls and handles them safely in user-space, stopping kernel escapes dead in their tracks.',
    alternatives: [
      { name: 'Kata Containers', pros: 'Uses lightweight VMs for strong isolation.', cons: 'Heavier resource footprint, requires nested virtualization support from the cloud provider.' },
      { name: 'Seccomp Profiles', pros: 'No performance overhead.', cons: 'Difficult to maintain; blocking the wrong syscall breaks legitimate programs.' }
    ]
  },
  {
    name: 'PostgreSQL',
    icon: Database,
    color: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    purpose: 'The primary persistent relational database.',
    why: 'We need ACID compliance to guarantee that user accounts, billing (if implemented), and execution histories are never corrupted. PostgreSQL is the industry standard for reliable, concurrent relational data storage.',
    alternatives: [
      { name: 'MongoDB', pros: 'Flexible schema for unstructured data.', cons: 'Lack of strict relational integrity; joining user data with execution logs becomes messy.' },
      { name: 'DynamoDB', pros: 'Infinite horizontal scale.', cons: 'Complex querying; vendor lock-in to AWS.' }
    ]
  }
];

export default function TechStackSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Technology Stack</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          Every technology in SecureCloud Run was chosen to solve a specific engineering bottleneck. Below is a deep dive into the "why" behind our stack, and the trade-offs considered against alternative solutions.
        </p>
      </div>

      {/* Tech Cards */}
      <div className="space-y-8">
        {techStack.map((tech) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className={`p-6 md:p-8 rounded-2xl border ${tech.border} bg-[#0a0a0f] relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${tech.bg} blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none`} />

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${tech.bg} ${tech.border} border`}>
                  <Icon className={tech.color} size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{tech.name}</h2>
              </div>

              <div className="space-y-6">

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Purpose</h4>
                  <p className="text-gray-200 text-base leading-relaxed">{tech.purpose}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Why It Was Chosen</h4>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-sm text-gray-300 leading-relaxed">{tech.why}</p>
                  </div>
                </div>

                {/* Alternatives Comparison */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Considered Alternatives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tech.alternatives.map((alt, i) => (
                      <div key={i} className="p-4 bg-[#11111a] border border-white/5 rounded-xl">
                        <h5 className="text-white font-semibold flex items-center gap-2 mb-3">
                          <Triangle size={14} className="text-muted rotate-90" /> {alt.name}
                        </h5>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-start gap-2 text-gray-400">
                            <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span><span className="text-gray-300 font-medium">Pros:</span> {alt.pros}</span>
                          </p>
                          <p className="flex items-start gap-2 text-gray-400">
                            <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                            <span><span className="text-gray-300 font-medium">Cons:</span> {alt.cons}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
}
