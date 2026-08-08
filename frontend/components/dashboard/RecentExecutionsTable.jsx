'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

export default function RecentExecutionsTable({ itemVariants, data = [] }) {
  return (
    <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white tracking-wide">Recent Executions</h3>
        <p className="text-sm text-muted mt-1">Live log of the latest code runs across the cluster.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-sm text-muted">
              <th className="pb-3 px-4 font-medium">Run ID</th>
              <th className="pb-3 px-4 font-medium">Language</th>
              <th className="pb-3 px-4 font-medium">Status</th>
              <th className="pb-3 px-4 font-medium">Time</th>
              <th className="pb-3 px-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((run, index) => (
              <tr key={run.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-default">
                <td className="py-4 px-4 font-mono text-accent text-xs">...{run.id.slice(-8)}</td>
                <td className="py-4 px-4 text-gray-300 uppercase">{run.language}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {run.status === 'COMPLETED' ? (
                      <>
                        <CheckCircle size={16} className="text-green-400" />
                        <span className="text-green-400 font-medium">Success</span>
                      </>
                    ) : run.status === 'FAILED' ? (
                      <>
                        <XCircle size={16} className="text-red-400" />
                        <span className="text-red-400 font-medium">Failed</span>
                      </>
                    ) : (
                      <>
                        <Clock size={16} className="text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{run.status}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-mono text-gray-400">{run.executionTimeMs}ms</td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No recent executions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
