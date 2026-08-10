'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Database, Cookie, Lock, ArrowLeft } from 'lucide-react';
import SpaceBackground from '@/components/SpaceBackground';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  const lastUpdated = "August 10, 2026";

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "Information Collection",
      content: "When you use SecureCloud Run, we collect minimal information necessary to provide the service. This may include your authentication details (like your email or GitHub username if you create an account) and the code snippets you explicitly submit for execution. We do not stealthily track your browsing habits across the site."
    },
    {
      id: "usage",
      icon: Lock,
      title: "Code Snippets & Execution Data",
      content: "Your submitted code is transmitted securely to our isolated execution environments. We do not permanently store your code snippets unless you explicitly choose to save them in your account dashboard. Executed code in the Playground is discarded from our primary memory after the sandbox is destroyed and results are returned."
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "Cookies & Tracking",
      content: "We use essential cookies to maintain your authenticated session. Because SecureCloud Run is a showcase platform, we do not employ aggressive third-party advertising trackers or sell your personal data to third-party data brokers."
    },
    {
      id: "sharing",
      icon: ShieldAlert,
      title: "Data Sharing",
      content: "This project is built as an open-source educational platform and showcase. We do not sell, rent, or lease any user data to third parties. Data is only processed internally to maintain the security and functionality of the execution sandboxes."
    }
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <SpaceBackground />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

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
            Privacy Policy
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            Your privacy is important to us. This policy outlines how we handle data within our sandboxed execution platform.
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
                <div className="p-3 rounded-lg bg-accent/10 text-accent">
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
