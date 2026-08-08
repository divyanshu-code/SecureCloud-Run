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
  HelpCircle 
} from 'lucide-react';

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
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 mb-8 lg:mb-0 lg:mr-12 lg:sticky lg:top-32 h-fit max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar pb-4">
      <div className="p-5 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-2">
          Documentation
        </h3>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group text-left
                  ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
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
    </aside>
  );
}
