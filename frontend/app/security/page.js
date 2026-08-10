'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Server, Network, Bug, ArrowLeft } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Link from 'next/link';

export default function SecurityPage() {
  const lastUpdated = "August 10, 2026";

  const sections = [
    {
      id: "architecture",
      icon: Server,
      title: "Sandbox Architecture",
      content: "All untrusted user code is executed in deeply isolated environments. We utilize Docker containers paired with gVisor to provide strong kernel-level isolation. This ensures that a compromised container cannot access the underlying host system kernel or affect other isolated environments."
    },
    {
      id: "resources",
      icon: ShieldCheck,
      title: "Strict Resource Limits",
      content: "Execution environments are tightly constrained. Hard limits are enforced on CPU utilization, memory consumption (RAM), and execution time (e.g., maximum 5-second timeouts). This prevents infinite loops, memory leaks, or denial-of-service attempts from exhausting server resources."
    },
    {
      id: "network",
      icon: Network,
      title: "Network Isolation",
      content: "By default, all code execution sandboxes are heavily restricted from accessing the external internet. Outbound network traffic is disabled to prevent sandboxes from being used as proxies for port scanning, DDoS attacks, or malware distribution."
    },
    {
      id: "bounty",
      icon: Bug,
      title: "Vulnerability Reporting",
      content: "We take the security of SecureCloud Run seriously. If you discover a sandbox escape or a vulnerability in our infrastructure, we encourage you to responsibly disclose it by opening a security advisory on our GitHub repository. Please do not exploit the vulnerability further than necessary to prove its existence."
    }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <SpaceBackground />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white mb-10 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-gray-400">
            Last Updated: {lastUpdated}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-6 tracking-tight">
            Security Overview
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            Running arbitrary code is dangerous. Learn how we utilize containerization and kernel isolation to keep the platform safe.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="glass p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 text-white/5 group-hover:text-white/10 transition-colors transform group-hover:scale-110 duration-500">
                <section.icon size={120} strokeWidth={1} />
              </div>
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <section.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{section.title}</h3>
                  <p className="text-muted leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
