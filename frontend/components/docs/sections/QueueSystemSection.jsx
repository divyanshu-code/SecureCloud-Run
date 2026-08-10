'use client';

import { motion } from 'framer-motion';
import { Users, ArrowDown, Database, Server, Box, CheckCircle2, ShieldAlert } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function QueueSystemSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl  mt-22 lg:mt-0 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Queue & Worker System</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          To truly understand why SecureCloud Run is built the way it is, we must look at how it handles massive, sudden spikes in traffic. The combination of a Redis queue and stateless workers guarantees system stability under extreme load.
        </p>
      </div>

      {/* The Scenario */}
      <div className="p-8 rounded-2xl bg-[#0a0a0f] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

        <h2 className="text-2xl font-bold text-white mb-6">The "1500 Users" Scenario</h2>
        <p className="text-gray-300 leading-relaxed mb-12">
          Suppose a popular programming influencer tweets a link to SecureCloud Run, and exactly <strong>1,500 users click the "Run" button at the exact same millisecond.</strong> Here is exactly what happens.
        </p>

        {/* Flow Diagram */}
        <div className="flex flex-col items-center max-w-2xl mx-auto space-y-2 relative z-10">

          {/* Step 1: Users */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#11111a] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="text-blue-400" size={20} />
                </div>
                <span className="font-semibold text-white">Incoming Requests</span>
              </div>
              <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded">1,500 Jobs</span>
            </div>
          </motion.div>

          <ArrowDown className="text-gray-600" size={20} />

          {/* Step 2: Queue */}
          <motion.div variants={itemVariants} className="w-full relative">
            <div className="flex flex-col p-4 rounded-xl bg-red-400/10 border border-red-400/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Database className="text-red-400" size={20} />
                  </div>
                  <span className="font-semibold text-white">Redis Queue (BullMQ)</span>
                </div>
                <span className="font-mono text-red-300 font-bold bg-red-400/20 px-3 py-1 rounded shadow-inner shadow-red-400/50">All 1,500 safely stored</span>
              </div>
              <div className="p-3 rounded-lg bg-[#11111a] border border-white/5 text-xs text-gray-400 shadow-inner">
                <strong>Instant API Response:</strong> The API responds instantly with 202 Accepted. It means that as soon as a background task finishes its job, the computer instantly wipes its memory and takes back that space for other programs to use.
              </div>
            </div>
          </motion.div>

          <ArrowDown className="text-gray-600" size={20} />

          {/* Step 3: Workers */}
          <motion.div variants={itemVariants} className="w-full">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#11111a] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Server className="text-emerald-400" size={20} />
                </div>
                <span className="font-semibold text-white">Worker Pool</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded">100 Workers Available</span>
            </div>
          </motion.div>

          <ArrowDown className="text-gray-600" size={20} />

          {/* Step 4: Active vs Waiting */}
          <motion.div variants={itemVariants} className="w-full flex gap-4">
            <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <Box className="text-green-400 mb-2" size={24} />
              <span className="text-2xl font-bold text-white mb-1">100</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider text-center">Active Containers</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <Database className="text-orange-400 mb-2" size={24} />
              <span className="text-2xl font-bold text-white mb-1">1,400</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider text-center">Waiting in Queue</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Why it Remains Stable */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white border-b border-white/10 pb-2">Why the System Remains Stable</h2>
        <p className="text-gray-300 leading-relaxed">
          In a synchronous architecture (without a queue), 1,500 simultaneous requests would force the server to attempt to spawn 1,500 Docker containers at once. The server would instantly run out of RAM, crash (OOM Kill), and <strong>all 1,500 users would receive a 502 Bad Gateway error.</strong>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-emerald-400" /> Controlled Concurrency
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Because we only have 100 workers, the server only ever provisions a maximum of 100 Docker containers at a time. The system's memory and CPU usage hits a predictable ceiling and stays there, completely avoiding OOM crashes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-emerald-400" /> Continuous Processing
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              As soon as a worker finishes its job (say, 500ms later), it destroys its container and instantly grabs the next job from the 1,400 waiting in Redis. The workers rapidly cycle through the queue until it hits 0.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-4">
          <ShieldAlert className="text-red-400 shrink-0" size={24} />
          <div>
            <h4 className="text-red-400 font-semibold mb-2">The Ultimate Trade-off</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              The one tradeoff with this design is that when there's a big queue of people waiting, users at the back of the line might wait a few seconds before their code actually starts running — the 1,500th person in line might wait 4-5 seconds longer than the first person. But a small wait is far better than the alternative, which is the entire platform crashing under the pressure and nobody getting a result at all.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mt-4">
              And yes — this wait time is not a fixed problem. If the queue is consistently getting long and users are waiting too long, you simply add more workers to pull jobs off the queue faster. More workers = shorter wait times. The system is designed so this is just a configuration change, not a redesign — you scale the worker pool up when demand is high and back down when it's quiet, so you're only paying for the extra capacity when you actually need it.
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
