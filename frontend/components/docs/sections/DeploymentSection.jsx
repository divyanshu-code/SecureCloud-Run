'use client';

import { motion } from 'framer-motion';
import { Cloud, Server, Database, GitBranch, ArrowRight, Activity, TerminalSquare } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

const environments = [
  {
    name: 'Frontend & API Gateway',
    provider: 'Vercel / Next.js',
    icon: Cloud,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'The React frontend and the lightweight Next.js API route (which validates payloads and pushes them to Redis) are deployed on Vercel for global edge caching and instant scalability.'
  },
  {
    name: 'Worker Pool (Compute)',
    provider: 'AWS EC2 / Auto Scaling',
    icon: Server,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    description: 'The heavy lifting is done on dedicated AWS EC2 instances running Linux. These instances have Docker and gVisor pre-installed. An Auto Scaling Group monitors the Redis queue depth and provisions new EC2 instances automatically if the queue grows too large.'
  },
  {
    name: 'Managed Databases',
    provider: 'AWS ElastiCache & RDS',
    icon: Database,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Redis is hosted on AWS ElastiCache for sub-millisecond latency. PostgreSQL is hosted on AWS RDS for automated backups, read replicas, and strict Multi-AZ fault tolerance.'
  }
];

export default function DeploymentSection() {
  return (
    <motion.div variants={contentVariants} initial="hidden" animate="visible" className="space-y-12 max-w-4xl pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-4 mt-12 lg:mt-0 tracking-tight">Deployment Strategy</h1>
        <p className="text-xl text-gray-300 leading-relaxed font-light">
          Because SecureCloud Run separates the API layer from the execution layer, we can deploy each component to the infrastructure that best suits its specific workload profile.
        </p>
      </div>

      {/* Infrastructure Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {environments.map((env) => {
          const Icon = env.icon;
          return (
            <motion.div 
              key={env.name}
              variants={itemVariants}
              className={`p-6 rounded-2xl bg-[#0a0a0f] border ${env.border} relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${env.bg} blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100`} />
              
              <Icon className={`${env.color} mb-4`} size={28} />
              <h3 className="font-bold text-white mb-1">{env.name}</h3>
              <div className="text-xs font-mono text-gray-400 mb-4 tracking-wider uppercase">{env.provider}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{env.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* CI/CD Pipeline */}
      <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
        
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <GitBranch className="text-white" /> Continuous Integration (CI/CD)
        </h2>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-xl bg-[#11111a] border border-white/5">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 shrink-0">
              <TerminalSquare size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">1. Developer Push</h4>
              <p className="text-sm text-gray-400">Code is merged into the <code className="text-accent bg-white/5 px-1 rounded">main</code> branch on GitHub.</p>
            </div>
          </div>

          <div className="hidden md:flex justify-center -my-2 text-gray-600">
            <ArrowRight className="rotate-90 md:rotate-0" size={20} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-xl bg-[#11111a] border border-white/5">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">2. GitHub Actions (Testing)</h4>
              <p className="text-sm text-gray-400">Automated tests spin up a local Docker container to verify execution safety and ensure no security regressions have occurred.</p>
            </div>
          </div>

          <div className="hidden md:flex justify-center -my-2 text-gray-600">
            <ArrowRight className="rotate-90 md:rotate-0" size={20} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-xl bg-[#11111a] border border-white/5">
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
              <Server size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">3. Automated Rollout</h4>
              <p className="text-sm text-gray-400">If tests pass, Vercel automatically deploys the frontend, and AWS CodeDeploy updates the Worker Pool instances with zero downtime.</p>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
