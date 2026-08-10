'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Ban, PowerOff, ArrowLeft } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = "August 10, 2026";

  const sections = [
    {
      id: "acceptable-use",
      icon: Ban,
      title: "Acceptable Use Policy",
      content: "SecureCloud Run provides isolated sandboxes for educational and developmental purposes. You agree NOT to use the platform for: cryptocurrency mining, launching network attacks (e.g., DDoS, port scanning), distributing malware, attempting to compromise the host infrastructure, or engaging in any illegal activities."
    },
    {
      id: "termination",
      icon: PowerOff,
      title: "Account Termination",
      content: "We strictly monitor resource usage to prevent abuse. We reserve the right to instantly terminate your execution environment, ban your IP address, or permanently suspend your account without prior notice if we detect violations of our Acceptable Use Policy."
    },
    {
      id: "disclaimer",
      icon: AlertTriangle,
      title: "Disclaimer of Warranties",
      content: "This platform is provided \"AS IS\" and \"AS AVAILABLE\" as a student showcase project. We do not guarantee 100% uptime, error-free code execution, or data persistence. You use the service at your own risk."
    },
    {
      id: "liability",
      icon: FileText,
      title: "Limitation of Liability",
      content: "In no event shall the creators of SecureCloud Run be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service, including but not limited to lost data or business interruptions."
    }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <SpaceBackground />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

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
            Terms of Service
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            By using SecureCloud Run, you agree to these terms. Our priority is keeping the platform safe and stable for everyone.
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
                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
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
