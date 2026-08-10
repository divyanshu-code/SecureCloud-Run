'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const GithubIcon = ({ size = 18, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.2 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);



export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isShowcaseMode = process.env.NEXT_PUBLIC_SHOWCASE_MODE === 'true';

  return (
    <footer className="relative bg-[#050508] border-t border-white/10 pt-16 pb-8 mt-30  overflow-hidden z-20">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-24 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl tracking-tighter text-text font-bold">
                SecureCloud<span className="text-accent">Run</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm mb-6">
              A high-performance, secure, and distributed execution pipeline. Run arbitrary code in fully isolated sandboxes at cloud scale.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="https://github.com/divyanshu-code/SecureCloud-Run" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                <GithubIcon size={18} />
              </a>

              <a href="https://www.linkedin.com/in/divyanshu-bisht-92b974291" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/20 hover:-translate-y-1 transition-all duration-300">
                <LinkedinIcon size={18} />
              </a>
              <a href="mailto:divyanshubisht5734@gmail.com" aria-label="Email" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:bg-accent/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns Container */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-8 lg:gap-8">
            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Product</h3>
              <ul className="space-y-4">
                <li>
                  {isShowcaseMode ? (
                    <div onClick={() => toast('This page requires login, which is disabled in Showcase Mode.', { icon: '' })} className="text-muted hover:text-white text-sm transition-colors group flex items-center cursor-pointer">
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">Playground</span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Playground</span>
                      </span>
                    </div>
                  ) : (
                    <Link href="/playground" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">Playground</span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Playground</span>
                      </span>
                    </Link>
                  )}
                </li>
                <li>
                  {isShowcaseMode ? (
                    <div onClick={() => toast('This page requires login, which is disabled in Showcase Mode.', { icon: '' })} className="text-muted hover:text-white text-sm transition-colors group flex items-center cursor-pointer">
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">Dashboard</span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Dashboard</span>
                      </span>
                    </div>
                  ) : (
                    <Link href="/dashboard" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">Dashboard</span>
                        <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Dashboard</span>
                      </span>
                    </Link>
                  )}
                </li>
                <li>
                  <Link href="/architecture" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">Architecture</span>
                      <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Architecture</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/docs" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">Documentation</span>
                      <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Documentation</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://github.com/divyanshu-code/SecureCloud-Run" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">GitHub</span>
                      <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">GitHub</span>
                    </span>
                  </a>
                </li>

                <li>
                  <Link href="/career" className="text-muted hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    Careers
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">Hiring</span>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="lg:text-sm text-xs text-gray-500">
            &copy; {currentYear} SecureCloud Run. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors text-sm">Terms of Service</Link>
            <Link href="/security" className="hover:text-white transition-colors text-sm">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
