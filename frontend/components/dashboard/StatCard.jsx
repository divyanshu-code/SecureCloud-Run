import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, icon: Icon, colorClass, itemVariants }) {
  return (
    <motion.div
      variants={itemVariants}
      className="p-6 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-500`} />

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
          <Icon size={24} />
        </div>
        {change && (
          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {change}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="text-gray-400 text-sm font-medium tracking-wide mb-1">{title}</div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
}
