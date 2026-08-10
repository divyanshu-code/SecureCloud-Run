'use client';

import { motion } from 'framer-motion';
import { Database, Table, Key, Hash, Clock, FileText, CheckCircle2 } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const tables = [
  {
    name: 'users',
    description: 'Stores authentication credentials and profile data for developers using the platform.',
    columns: [
      { name: 'id', type: 'UUID', key: 'Primary Key', description: 'Unique identifier for the user.' },
      { name: 'email', type: 'VARCHAR', key: 'Unique Index', description: 'The user\'s login email address.' },
      { name: 'password_hash', type: 'VARCHAR', key: null, description: 'Bcrypt hashed password.' },
      { name: 'created_at', type: 'TIMESTAMP', key: null, description: 'When the account was created.' }
    ]
  },
  {
    name: 'executions',
    description: 'Maintains a permanent, immutable ledger of every code execution requested on the platform.',
    columns: [
      { name: 'id', type: 'UUID', key: 'Primary Key', description: 'Matches the Job ID returned by the API.' },
      { name: 'user_id', type: 'UUID', key: 'Foreign Key', description: 'References users.id. Links the execution to the submitter.' },
      { name: 'language', type: 'VARCHAR', key: null, description: 'Programming language used (e.g., python, node).' },
      { name: 'code', type: 'TEXT', key: null, description: 'The raw source code payload.' },
      { name: 'status', type: 'ENUM', key: 'Index', description: 'waiting, active, completed, failed.' },
      { name: 'output', type: 'TEXT', key: null, description: 'Captured stdout and stderr.' },
      { name: 'execution_time_ms', type: 'INTEGER', key: null, description: 'Total runtime in milliseconds.' },
      { name: 'created_at', type: 'TIMESTAMP', key: 'Index', description: 'When the job was queued.' }
    ]
  }
];

const SchemaTable = ({ table }) => (
  <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-[#0a0a0f] overflow-hidden">
    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
      <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/20">
        <Table className="text-blue-400" size={24} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1 font-mono">{table.name}</h3>
        <p className="text-sm text-gray-400">{table.description}</p>
      </div>
    </div>

    {/* Mobile Card Layout */}
    <div className="md:hidden p-4 space-y-4 bg-[#050508]/50">
      {table.columns.map((col, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="font-mono text-gray-200 font-semibold text-sm">{col.name}</span>
            <span className="font-mono text-purple-400 text-xs px-2 py-1 bg-purple-400/10 rounded-md border border-purple-400/20">{col.type}</span>
          </div>
          {col.key && (
            <div>
              {col.key === 'Primary Key' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-semibold border border-yellow-500/20"><Key size={12} /> PK</span>}
              {col.key === 'Foreign Key' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20"><Key size={12} /> FK</span>}
              {col.key === 'Unique Index' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20"><Hash size={12} /> UNIQUE</span>}
              {col.key === 'Index' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-500/10 text-gray-400 text-xs font-semibold border border-gray-500/20"><Hash size={12} /> INDEX</span>}
            </div>
          )}
          <p className="text-gray-400 text-sm leading-relaxed">{col.description}</p>
        </div>
      ))}
    </div>

    {/* Desktop Table Layout */}
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-[#11111a] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
            <th className="px-6 py-4 font-semibold">Column</th>
            <th className="px-6 py-4 font-semibold">Type</th>
            <th className="px-6 py-4 font-semibold">Constraint</th>
            <th className="px-6 py-4 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {table.columns.map((col, idx) => (
            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 font-mono text-gray-300 font-medium">{col.name}</td>
              <td className="px-6 py-4 font-mono text-purple-400">{col.type}</td>
              <td className="px-6 py-4">
                {col.key === 'Primary Key' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-semibold border border-yellow-500/20"><Key size={12} /> PK</span>}
                {col.key === 'Foreign Key' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20"><Key size={12} /> FK</span>}
                {col.key === 'Unique Index' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20"><Hash size={12} /> UNIQUE</span>}
                {col.key === 'Index' && <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-500/10 text-gray-400 text-xs font-semibold border border-gray-500/20"><Hash size={12} /> INDEX</span>}
              </td>
              <td className="px-6 py-4 text-gray-400 leading-relaxed">{col.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default function DatabaseSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-5xl  mt-22 lg:mt-0 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Database Design</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          While Redis acts as the volatile, high-speed queue, PostgreSQL serves as the permanent source of truth. The schema is highly normalized to guarantee ACID compliance for execution history and user data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <Database className="text-blue-400 mb-4" size={24} />
          <h4 className="text-white font-semibold mb-2">PostgreSQL 16</h4>
          <p className="text-sm text-gray-400">Chosen for its unbeatable JSONB support and robust relational integrity.</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <FileText className="text-emerald-400 mb-4" size={24} />
          <h4 className="text-white font-semibold mb-2">Prisma ORM</h4>
          <p className="text-sm text-gray-400">Provides fully type-safe database queries and automated schema migrations.</p>
        </div>
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <Clock className="text-orange-400 mb-4" size={24} />
          <h4 className="text-white font-semibold mb-2">Immutability</h4>
          <p className="text-sm text-gray-400">Execution records are strictly append-only. Once a job completes, its row is never updated.</p>
        </div>
      </div>

      <div className="space-y-12">
        {tables.map(table => (
          <SchemaTable key={table.name} table={table} />
        ))}
      </div>

    </motion.div>
  );
}
