import Link from 'next/link';
import { Mail } from 'lucide-react';

const GithubIcon = ({ size = 18, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.2 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

const TwitterIcon = ({ size = 18, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050508] border-t border-white/10 pt-16 pb-8 mt-30  overflow-hidden z-20">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-xl h-24 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

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
              <a href="#" aria-label="GitHub" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                <GithubIcon size={18} />
              </a>

              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/20 hover:-translate-y-1 transition-all duration-300">
                <TwitterIcon size={18} />
              </a>
              <a href="#" aria-label="Email" className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-accent hover:bg-accent/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/playground" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Playground</span>
                    <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Playground</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">Dashboard</span>
                    <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">Dashboard</span>
                  </span>
                </Link>
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
                <a href="#" className="text-muted hover:text-white text-sm transition-colors group flex items-center">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">GitHub</span>
                    <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-accent">GitHub</span>
                  </span>
                </a>
              </li>

              <li>
                <a href="#" className="text-muted hover:text-white text-sm transition-colors flex items-center gap-2 group">
                  Careers
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">Hiring</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} SecureCloud Run. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
