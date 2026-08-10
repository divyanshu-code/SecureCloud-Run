'use client';

import { motion } from 'framer-motion';
import { Network, Database, Cpu, Box, Shield, Server, LayoutTemplate, ShieldAlert } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const layers = [
  {
    title: 'Browser / Client',
    icon: LayoutTemplate,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    purpose: 'The entry point for end users to write and submit code.',
    responsibilities: [
      'Provides the Monaco Editor interface.',
      'Handles syntax highlighting and autocomplete.',
      'Connects via WebSockets/HTTP to submit code payloads.'
    ],
    why: 'We need a lightweight, browser-based IDE so users do not have to install local compilers.',
    ifRemoved: 'Without a proper interface, developers would have to test the system by manually typing technical commands into a terminal (cURL) or using a separate testing tool (Postman) just to send their code and see the output — instead of simply typing in a box and clicking "Run." Thats a slow, frustrating experience that most users would not bother with, which defeats the whole point of building the feature in the first place.'
  },
  {
    title: 'API Gateway',
    icon: Network,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    purpose: 'This is the first door every request walks through. Before anything else happens — before the queue, before the workers, before any code runs — all incoming traffic hits this point first, where it gets checked and directed to the right place.',
    responsibilities: [
      'Authenticates users and validates JWTs.',
      'Enforces rate limiting (e.g., max 10 requests/min).',
      'Validates the size and format of the code payload.',
      'Pushes validated requests to the Redis Queue.'
    ],
    why: 'To protect internal services. It ensures only valid, authenticated, and size-limited code payloads ever reach the internal queue.',
    ifRemoved: 'If the machines that actually run user code were directly reachable from the internet, anyone could bombard them with requests to crash them (a DDoS attack), or worse, send malicious code directly to them without going through any of the safety checks (authentication, rate limiting, validation) that sit in front.'
  },
  {
    title: 'Redis Queue & BullMQ',
    icon: Database,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    purpose: 'This is the waiting room where all code execution requests go after passing the gate. Instead of running code immediately, the system places each request into a queue, like putting tasks on a to-do list.',
    responsibilities: [
      'Holds pending code executions in a FIFO (First-In, First-Out) queue.',
      'Maintains job state (waiting, active, completed, failed).',
      'Provides mechanisms for real-time status updates. '
    ],
    why: 'The API just drops the job into the queue and is immediately free to handle the next request, while workers process jobs at their own pace in the background. This means even if thousands of people click "Run" at the same moment, the system just adds them all to the queue and works through them without breaking a sweat.',
    ifRemoved: 'The API server would have to wait for code to finish running. A sudden spike of 10,000 users would crash the API server instantly due to thread starvation.'
  },
  {
    title: 'Worker Pool',
    icon: Server,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    purpose: 'A group of worker programs that can grow or shrink in number based on how much work there is to do. "Stateless" means each worker does not remember anything between jobs — it picks up a job, does it, forgets about it, and moves on to the next one. Because of this, you can add more workers at any time without any of them needing to coordinate or share memory with each other.',
    responsibilities: [
      'Continuously polls Redis for new jobs.',
      'Writes the user code to a temporary file.',
      'Spawns and manages the Docker container lifecycle.',
      'Captures stdout/stderr and reports back to Redis.'
    ],
    why: 'We need dedicated compute nodes whose sole job is to manage heavy compilation and execution tasks, keeping the API layer lightweight.',
    ifRemoved: 'The API Gateway would have to manage Docker containers itself, violating the separation of concerns and severely limiting scalability.'
  },
  {
    title: 'Docker',
    icon: Box,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    purpose: 'The containerization engine providing isolated runtime environments.',
    responsibilities: [
      'Packages the language runtime (Node, Python, Go) into an image.',
      'Provides a fresh, disposable filesystem for every execution.',
      'Enforces cgroup limits (CPU and Memory quotas).'
    ],
    why: 'We cannot install every programming language on the host machine, nor can we allow user code to write files to the host OS.',
    ifRemoved: 'Code would execute directly on the host VM. A user could run `rm -rf /` and wipe the entire worker server.'
  },
  {
    title: 'gVisor',
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    purpose: 'A user-space kernel that intercepts and filters system calls.',
    responsibilities: [
      'Prevents the Docker container from accessing the true host kernel.',
      'Strips network access privileges entirely.',
      'Thwarts kernel-level container escape vulnerabilities.'
    ],
    why: 'Standard Docker shares the host kernel. If a zero-day exploit exists in the Linux kernel, an attacker inside Docker could escape to the host.',
    ifRemoved: 'The platform would be vulnerable to container escapes, potentially allowing attackers to compromise the underlying AWS/GCP infrastructure.'
  },
  {
    title: 'PostgreSQL',
    icon: Database,
    color: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    purpose: 'The persistent, relational database for the platform.',
    responsibilities: [
      'Stores user accounts and authentication credentials.',
      'Maintains a permanent history of past code executions.',
      'Stores platform metrics and analytics.'
    ],
    why: 'We need a robust, ACID-compliant database to ensure data integrity for user profiles and execution history over time.',
    ifRemoved: 'Redis would eventually run out of memory if used for permanent storage, and users would lose their entire execution history if the cache restarted.'
  }
];

export default function ArchitectureSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12  mt-22 lg:mt-0 max-w-4xl">

      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">System Architecture</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">

          The system is built in separate layers, where each layer has one clear job and nothing else. Code never gets executed directly — it first passes through a queue, which acts as a buffer between the user and the actual execution. Because each layer only does its own job independently, you can scale any part of it (add more workers, more API servers, etc.) without touching the rest, and there's no single point where everything can break or get compromised at once.
        </p>
      </div>

      {/* Layers Breakdown */}
      <div className="space-y-8">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.title}
              variants={itemVariants}
              className={`p-6 md:p-8 rounded-2xl border ${layer.border} bg-[#0a0a0f] relative overflow-hidden`}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${layer.bg} blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none`} />

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${layer.bg} ${layer.border} border`}>
                  <Icon className={layer.color} size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{layer.title}</h2>
              </div>

              <div className="space-y-6">

                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Purpose</h4>
                  <p className="text-gray-200 text-base leading-relaxed">{layer.purpose}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Responsibilities</h4>
                    <ul className="space-y-2">
                      {layer.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-accent mt-1">•</span>
                          <span className="leading-relaxed">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Why It Exists</h4>
                      <p className="text-sm text-gray-300 leading-relaxed p-3 bg-white/5 rounded-lg border border-white/5">
                        {layer.why}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldAlert size={14} /> If Removed
                      </h4>
                      <p className="text-sm text-red-200/80 leading-relaxed p-3 bg-red-500/10 rounded-lg border border-red-500/10">
                        {layer.ifRemoved}
                      </p>
                    </div>
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
