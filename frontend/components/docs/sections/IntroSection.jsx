'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Server, Network } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function IntroSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 mt-22 lg:mt-0 max-w-4xl">

      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Introduction</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          SecureCloud Run is a secure online compiler that lets users write, compile, and execute code in multiple programming languages. Every execution takes place inside an isolated Docker container, ensuring that user code cannot affect the main server or other users.
        </p>
      </div>

      {/* The Problem Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2">The Problem: Why Code Execution is Dangerous</h2>
        <p className="text-gray-300 leading-relaxed text-base">
          Running user code directly on the server is dangerous. A user could accidentally or intentionally write harmful code that accesses sensitive files, crashes the server, or affects other users. To prevent this, every program is executed inside a secure, isolated Docker container instead of on the main server.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[30px] rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />
            <ShieldAlert className="text-red-400 mb-4" size={28} />
            <h3 className="text-white font-semibold mb-2">Direct Execution (Anti-Pattern)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              In this approach, user code runs directly on the main server without any isolation. If the code is malicious or contains harmful commands, it could access sensitive data, damage the server, or impact other users. This is why direct execution should always be avoided.
            </p>
          </div>
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />
            <Server className="text-emerald-400 mb-4" size={28} />
            <h3 className="text-white font-semibold mb-2">Distributed Execution (Our Approach)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              SecureCloud Run uses a queue and multiple workers to execute code efficiently. Each worker processes one request at a time by creating a temporary Docker container. Once the program finishes, the output is returned and the container is removed. This approach improves performance, supports multiple users, and keeps the main server protected.
            </p>
          </div>
        </div>
      </section>

      {/* Why Distributed Architecture Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2">Why a Distributed Architecture?</h2>
        <p className="text-gray-300 leading-relaxed text-base">
          SecureCloud Run does not execute code synchronously. When a request arrives at the API Gateway, it is immediately pushed into a high-performance Redis queue (managed by BullMQ). This architecture solves three critical engineering challenges:
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium mb-1">Fault Isolation</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                If a user submits an infinite loop or a fork bomb, it crashes an isolated worker container, not the main API server. The API Gateway remains highly available to serve other requests.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium mb-1">Traffic Spikes & Backpressure</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                During high-traffic events, the Redis queue acts as a shock absorber. Instead of the API server running out of memory trying to spawn thousands of containers simultaneously, jobs wait safely in the queue until a worker is free.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-xl">
            <div>
              <h4 className="text-white font-medium mb-1">Horizontal Scalability</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                The platform can easily grow as more users join. If the current workers become busy, additional workers can be created automatically. Each new worker starts processing jobs from the Redis Queue, allowing multiple code execution requests to run at the same time.
              </p>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
