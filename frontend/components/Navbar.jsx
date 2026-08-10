"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../src/store/useAuthStore';
import { initSocket, disconnectSocket } from '@/src/lib/socket/socket';

const Github = ({ size = 24, className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.5 5.5 0 0 0-.2 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);
import Button from '@/components/Button';

// Removed LogoIcon

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const isShowcaseMode = process.env.NEXT_PUBLIC_SHOWCASE_MODE === 'true';

  // Hydration safe auth state extraction
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-connect socket if the user is authenticated
    if (isAuthenticated) {
      initSocket();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    disconnectSocket();
    logout();
    toast.success('Logged out successfully!');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Playground', href: '/playground' },
    { name: 'Architecture', href: '/architecture' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Docs', href: '/docs' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {isShowcaseMode && (
        <div className="bg-accent text-black text-xs font-semibold py-1.5 px-4 text-center z-50 flex items-center justify-center">
          <span className="mr-2"></span> SecureCloud Run is currently in Showcase Mode. The execution backend is offline to save server costs. Feel free to explore the UI!
        </div>
      )}
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group">
                <span className=" text-2xl tracking-tighter text-text transition-colors">
                  SecureCloud<span className="text-accent ">Run</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex space-x-1 lg:space-x-4" onMouseLeave={() => setHoveredTab(null)}>
                {navLinks.map((link) => (
                  <li
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setHoveredTab(link.name)}
                  >
                    {isShowcaseMode && (link.name === 'Playground' || link.name === 'Dashboard') ? (
                      <div
                        onClick={() => toast('This page requires login, which is disabled in Showcase Mode.', { icon: '' })}
                        className={`cursor-pointer relative block px-3 py-2 text-sm font-medium transition-colors ${hoveredTab === link.name ? 'text-text' : 'text-muted hover:text-text'}`}
                      >
                        {link.name}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`relative block px-3 py-2 text-sm font-medium transition-colors ${hoveredTab === link.name ? 'text-text' : 'text-muted hover:text-text'}`}
                      >
                        {link.name}
                      </Link>
                    )}
                    {hoveredTab === link.name && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-accent rounded-t-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.25, stiffness: 130, damping: 15, duration: 0.3 }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3.5">
              <motion.a
                href="https://github.com/divyanshu-code/SecureCloud-Run"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-text hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                aria-label="GitHub"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} />
              </motion.a>
              {mounted && isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 mr-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 text-accent font-semibold text-sm">
                      {(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} className="text-accent" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  {isShowcaseMode ? (
                    <motion.div
                      onClick={() => toast('Login is disabled in Showcase Mode because the backend database is offline.', { icon: '' })}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text rounded-md transition-colors group cursor-pointer"
                    >
                      <span>Login</span>
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
                    </motion.div>
                  ) : (
                    <Link href="/login">
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text rounded-md transition-colors group cursor-pointer"
                      >
                        <span>Login</span>
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
                      </motion.div>
                    </Link>
                  )}
                  {isShowcaseMode ? (
                    <motion.button
                      onClick={() => toast('Signup is disabled in Showcase Mode.', { icon: '' })}
                      className="relative overflow-hidden rounded-md bg-primary px-5 py-2 text-sm font-medium text-white shadow-md transition-all group cursor-pointer"
                    >
                      <span className="relative z-10">Get Started</span>
                    </motion.button>
                  ) : (
                    <Link href="/login?mode=signup">
                      <motion.button
                        className="relative overflow-hidden rounded-md bg-primary px-5 py-2 text-sm font-medium text-white shadow-md transition-all group cursor-pointer"
                      >
                        <span className="relative z-10">Get Started</span>
                        <motion.div
                          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                          initial={{ x: '-150%' }}
                          animate={{ x: '150%' }}
                          transition={{
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 1.5,
                            ease: 'linear',
                            repeatDelay: 2.5,
                          }}
                        />
                      </motion.button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-accent rounded-md p-2"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-[#050508]/95 backdrop-blur-2xl overflow-hidden border-t border-white/5"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
                {navLinks.map((link) => {
                  if (isShowcaseMode && (link.name === 'Playground' || link.name === 'Dashboard')) {
                    return (
                      <div
                        key={link.name}
                        className="cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-text hover:bg-white/5 transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          toast('This page requires login, which is disabled in Showcase Mode.', { icon: '' });
                        }}
                      >
                        {link.name}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted hover:text-text hover:bg-white/5 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col space-y-3">
                  {mounted && isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center border border-accent/50 text-accent font-semibold">
                          {(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-base font-medium text-white">
                          {user?.name || user?.username || user?.email || 'User'}
                        </span>
                      </div>
                      <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center justify-between px-3 py-2 text-base font-medium text-text rounded-md hover:bg-white/5 transition-colors cursor-pointer w-full text-left"
                      >
                        <span>Logout</span>
                        <LogOut size={18} className="text-accent" />
                      </button>
                    </>
                  ) : (
                    <>
                      {isShowcaseMode ? (
                        <motion.div
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-between px-3 py-2 text-base font-medium text-text rounded-md transition-colors group cursor-pointer"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            toast('Login is disabled in Showcase Mode.', { icon: '' });
                          }}
                        >
                          <span>Login</span>
                          <ArrowRight size={18} className="text-accent opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </motion.div>
                      ) : (
                        <Link href="/login">
                          <motion.div
                            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between px-3 py-2 text-base font-medium text-text rounded-md transition-colors group cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>Login</span>
                            <ArrowRight size={18} className="text-accent opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </motion.div>
                        </Link>
                      )}
                      <div className="px-3 flex items-center justify-between">
                        {isShowcaseMode ? (
                          <div className="w-full">
                            <motion.button
                              className="relative overflow-hidden rounded-lg bg-primary px-5 py-2 text-base font-medium text-white shadow-md transition-all w-full group flex justify-center"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                toast('Signup is disabled in Showcase Mode.', { icon: '' });
                              }}
                            >
                              <span className="relative z-10">Get Started</span>
                            </motion.button>
                          </div>
                        ) : (
                          <Link href="/login?mode=signup" className="w-full">
                            <motion.button
                              className="relative overflow-hidden rounded-lg bg-primary px-5 py-2 text-base font-medium text-white shadow-md transition-all w-full group flex justify-center"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span className="relative z-10">Get Started</span>
                              <motion.div
                                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                initial={{ x: '-150%' }}
                                animate={{ x: '150%' }}
                                transition={{
                                  repeat: Infinity,
                                  repeatType: 'loop',
                                  duration: 1.5,
                                  ease: 'linear',
                                  repeatDelay: 2.5,
                                }}
                              />
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                  <div className="px-3 pt-2 pb-2">
                    <motion.a
                      href="https://github.com/divyanshu-code/SecureCloud-Run"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-base font-medium text-muted hover:text-text hover:bg-white/5 rounded-md transition-colors border border-transparent hover:border-white/10"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Github size={20} className="mr-3" />
                      Star us on GitHub
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
