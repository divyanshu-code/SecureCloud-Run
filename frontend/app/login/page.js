'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import SpaceBackground from '@/components/SpaceBackground';
import useAuthStore from '@/src/store/useAuthStore';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Check URL parameters for signup mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'signup') {
        setIsLoginView(false);
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear errors when toggling views
  useEffect(() => {
    clearError();
  }, [isLoginView, clearError]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (isLoginView) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.username, formData.email, formData.password);
    }

    if (result.success) {
      toast.success(isLoginView ? 'Successfully logged in!' : 'Account created successfully!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Authentication failed');
    }
  };

  const handleOAuthClick = (provider) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (provider === 'GitHub') {
      window.location.href = `${baseUrl}/api/v1/auth/github`;
    } else if (provider === 'Google') {
      window.location.href = `${baseUrl}/api/v1/auth/google`;
    }
  };

  return (
    <div className="relative min-h-screen pt-15 flex items-center justify-center overflow-hidden px-4">
      <SpaceBackground />

      {/* Decorative blurred Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/40">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              key={isLoginView ? 'login' : 'register'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tight text-white "
            >
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
            <p className="text-muted text-sm">
              {isLoginView
                ? 'Enter your credentials to access the platform.'
                : 'Sign up to start executing code securely.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLoginView && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-1"
                >
                  <label className="text-xs font-medium text-white/70 uppercase tracking-wider ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={18} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                      required={!isLoginView}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70 uppercase tracking-wider ml-1 flex justify-between">
                <span>Password</span>
                {isLoginView && <a href="#" className="text-accent/80 hover:text-accent capitalize normal-case text-xs transition-colors">Forgot?</a>}
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none p-1 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full relative overflow-hidden rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all group mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{isLoginView ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={16} className="relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
              {!isLoading && (
                <motion.div
                  className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-150%' }}
                  animate={{ x: '150%' }}
                  transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.5, ease: 'linear', repeatDelay: 2.5 }}
                />
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0f1115] px-4 text-muted uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          {/* Social OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOAuthClick('GitHub')}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
            >
              <FaGithub size={18} />
              GitHub
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleOAuthClick('Google')}
              type="button"
              className="flex items-center justify-center gap-2 py-2 px-4 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <FcGoogle size={18} />
              Google
            </motion.button>
          </div>

          {/* Toggle View */}
          <div className="mt-8 text-center text-sm text-muted">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-accent font-medium hover:text-accent-hover hover:underline transition-colors focus:outline-none"
            >
              {isLoginView ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
