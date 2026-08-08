'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Lock, ListOrdered } from 'lucide-react';

const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } }
};

export default function DetailPanel({ selectedNode, onClose }) {
  if (!selectedNode) return null;

  const { data } = selectedNode;

  return (
    <AnimatePresence>
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-[#0a0a0f]/95 backdrop-blur-2xl border-l border-white/10 z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white tracking-wide">{data.label}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Meta Info */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.details?.description || "Detailed technical specifications for this component."}
              </p>
            </div>

            {/* Spec grid */}
            {data.details?.specs && (
              <div className="grid grid-cols-2 gap-4">
                {data.details.specs.map((spec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#11111a] border border-white/5">
                    <div className="text-xs text-muted mb-1 uppercase tracking-wider">{spec.label}</div>
                    <div className="text-sm font-semibold text-white">{spec.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Code Snippet */}
            {data.details?.code && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Code size={16} className="text-accent" /> Example Configuration
                </h3>
                <div className="p-4 rounded-xl bg-black border border-white/10 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    <code>{data.details.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Execution Flow */}
            {data.details?.flow && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <ListOrdered size={16} className="text-blue-400" /> Execution Flow
                </h3>
                <ol className="space-y-3 relative border-l border-white/10 ml-2 pl-4">
                  {data.details.flow.map((step, i) => (
                    <li key={i} className="text-sm text-gray-300 relative">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-[#0a0a0f]"></span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Security */}
            {data.details?.security && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Lock size={16} className="text-orange-400" /> Security Posture
                </h3>
                <ul className="space-y-2">
                  {data.details.security.map((sec, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      {sec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
