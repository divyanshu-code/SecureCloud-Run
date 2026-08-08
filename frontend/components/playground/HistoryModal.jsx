import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useHistoryStore } from '@/src/store/history.store';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryModal({ isOpen, onClose }) {
  const {
    executionHistory,
    isLoadingHistory,
    pagination,
    filters,
    setFilters,
    setPage,
    fetchHistory,
    deleteHistoryItem
  } = useHistoryStore();

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, filters, pagination.page, fetchHistory]);

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle2 size={16} className="text-green-400" />;
    if (status === 'Failed') return <XCircle size={16} className="text-red-400" />;
    if (status === 'Waiting') return <Loader2 size={16} className="text-yellow-400 animate-pulse" />;
    return <Loader2 size={16} className="text-blue-400 animate-spin" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm mt-17 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-5xl h-[85vh] bg-[#111318] border border-white/10 rounded-xl flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0f]">
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Execution History</h2>
                <p className="text-sm text-gray-400 mt-1">Review your past runs, execution times, and metrics.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Toolbar (Search & Filters) */}
            <div className="flex flex-wrap gap-4 p-4 border-b border-white/5 bg-[#0a0a0f]/50">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search code or outputs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-full bg-[#1e1e24] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <select
                value={filters.language}
                onChange={(e) => setFilters({ language: e.target.value })}
                className="bg-[#1e1e24] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none cursor-pointer"
              >
                <option value="">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
                className="bg-[#1e1e24] border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Waiting</option>
                <option value="Running">Running</option>
              </select>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-auto relative">
              {isLoadingHistory && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#111318]/50 backdrop-blur-sm">
                  <Loader2 size={32} className="animate-spin text-primary" />
                </div>
              )}

              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#0a0a0f] text-xs uppercase text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Language</th>
                    <th className="px-6 py-4 font-medium">Execution Time</th>
                    <th className="px-6 py-4 font-medium">Memory</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {executionHistory.length === 0 && !isLoadingHistory ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No execution history found.
                      </td>
                    </tr>
                  ) : (
                    executionHistory.map((job) => (
                      <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(job.status)}
                            <span className={
                              job.status === 'Completed' ? 'text-green-400' : 
                              job.status === 'Failed' ? 'text-red-400' : 
                              job.status === 'Waiting' ? 'text-yellow-400' :
                              'text-blue-400'
                            }>
                              {job.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 uppercase font-medium text-gray-300">
                          {job.language}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono">
                          {job.executionTimeMs ? `${job.executionTimeMs}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono">
                          {job.metrics?.memoryUsageMb ? `${job.metrics.memoryUsageMb} MB` : '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteHistoryItem(job.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between p-4 border-t border-white/10 bg-[#0a0a0f]">
              <span className="text-sm text-gray-500">
                Showing {executionHistory.length} of {pagination.total} entries
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-400 px-4">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
