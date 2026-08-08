'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Network, Box, Lock, Clock, FileText, Cpu, EyeOff, Trash2, ShieldCheck } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const securityFeatures = [
  {
    title: 'Docker & Linux Namespaces',
    icon: Box,
    color: 'text-blue-400',
    description: 'Docker relies on Linux Namespaces to create the illusion that the code is running on its own dedicated computer. It hides the host machine\'s processes, users, and network interfaces from the code inside the sandbox.'
  },
  {
    title: 'gVisor Kernel Isolation',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    description: 'Normal Docker containers share the host computer\'s operating system kernel. gVisor intercepts all system calls made by the code and handles them safely in user-space. This prevents attackers from exploiting Linux zero-day vulnerabilities to escape the container.'
  },
  {
    title: 'cgroups (Resource Limits)',
    icon: Cpu,
    color: 'text-purple-400',
    description: 'Every Docker container is given a fixed amount of CPU and memory. For example, a container can use up to 128 MB of memory and 0.5 CPU cores. If a program tries to use more resources—such as entering an infinite loop or causing a memory leak—the container is automatically stopped. This ensures that one user\'s code cannot slow down, crash, or affect the main server or other users.'
  },
  {
    title: 'Execution Timeout',
    icon: Clock,
    color: 'text-yellow-400',
    description: 'Every execution has a strict 5-second time limit. If a user writes an infinite loop (e.g., `while(true) {}`), the worker forcefully terminates the container when the timer expires, preventing the system from hanging.'
  },
  {
    title: 'Network Isolation',
    icon: Network,
    color: 'text-cyan-400',
    description: 'Containers are launched with the `--network none` flag. The sandbox has zero internet access. This prevents malicious code from downloading malware, performing DDoS attacks, or scanning the internal AWS VPC.'
  },
  {
    title: 'Read-Only Filesystem',
    icon: Lock,
    color: 'text-red-400',
    description: 'The root filesystem of the container is mounted as strictly read-only. The untrusted code cannot overwrite system files, modify installed binaries, or install persistent backdoors.'
  },
  {
    title: 'Temporary Storage Limit',
    icon: FileText,
    color: 'text-orange-400',
    description: 'Since the root is read-only, we provide a tiny `tmpfs` (in-memory) volume mounted at `/tmp` for temporary file operations. This is limited to 10MB to prevent disk exhaustion attacks.'
  },
  {
    title: 'No Environment Variables',
    icon: EyeOff,
    color: 'text-gray-400',
    description: 'All sensitive environment variables (like Database URLs, Redis passwords, and API keys) are stripped from the sandbox environment. If the code dumps the `env`, it will find absolutely nothing useful.'
  },
  {
    title: 'Ephemeral Destruction',
    icon: Trash2,
    color: 'text-pink-400',
    description: 'The sandbox is disposable. Regardless of whether the code succeeds, fails, or times out, the container and its temporary volumes are immediately and irreversibly destroyed. The next execution gets a completely fresh, sterile environment.'
  }
];

export default function SecuritySection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl pb-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Sandbox Security</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          Executing code from users is one of the biggest security challenges for an online compiler. To protect the platform, SecureCloud Run uses multiple layers of security. Every program runs inside an isolated Docker container with additional protection from gVisor, ensuring that even if the code behaves unexpectedly, the main server and other users remain safe.
        </p>
      </div>

      {/* Warning Box */}
      <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-4">
        <ShieldAlert className="text-orange-400 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="text-orange-400 font-bold mb-2">Defense in Depth</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            No security solution is perfect on its own. That's why SecureCloud Run uses multiple layers of protection instead of relying on a single one. Every program runs inside an isolated Docker container with additional safeguards such as gVisor, restricted file access, no internet access, and CPU and memory limits. Even if one layer is bypassed, the remaining layers continue to protect the main server.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-white/10 transition-colors duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={feature.color} size={20} />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
}
