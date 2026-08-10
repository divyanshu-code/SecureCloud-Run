'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Server,
  Layers,
  Activity,
  ListTree,
  Shield,
  Code2,
  Database,
  Rocket,
  Map,
  HelpCircle,
  ArrowRight,
  X
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'intro', label: '1. Introduction', icon: BookOpen },
  { id: 'architecture', label: '2. Architecture', icon: Server },
  { id: 'techstack', label: '3. Technology Stack', icon: Layers },
  { id: 'flow', label: '4. Execution Flow', icon: Activity },
  { id: 'queue', label: '5. Queue & Worker System', icon: ListTree },
  { id: 'security', label: '6. Sandbox Security', icon: Shield },
  { id: 'database', label: '7. Database Design', icon: Database },
  { id: 'deployment', label: '8. Deployment', icon: Rocket },
  { id: 'roadmap', label: '9. Development Roadmap', icon: Map },
  { id: 'faq', label: '10. FAQ', icon: HelpCircle },
];



export default function Sidebar({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  // Open by default on mobile devices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(true);
    }
  }, []);

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const SidebarContent = ({ isMobile }) => (
    <div className={`p-5 h-full ${isMobile ? 'pt-38 rounded-none bg-[#0a0a0f] border-r border-white/10' : 'rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5'} flex flex-col`}>
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Documentation
        </h3>
        {isMobile && (
          <button className="text-white/50 hover:text-white" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pb-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group text-left
                ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? "mobile-active-indicator" : "desktop-active-indicator"}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-full"
                />
              )}
              <Icon size={16} className={`shrink-0 ${isActive ? 'text-accent' : 'group-hover:text-gray-300'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed left-0 top-32 z-30 p-2 bg-[#0a0a0f]/95 backdrop-blur-md border border-l-0 border-white/10 rounded-r-lg shadow-xl text-white hover:bg-white/10 transition-colors"
        aria-label="Open documentation menu"
      >
        <ArrowRight size={20} />
      </button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm z-50 lg:hidden"
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 mr-12 sticky top-32 h-fit max-h-[calc(100vh-10rem)] z-20">
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
}
