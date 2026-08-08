'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import SpaceBackground from '@/components/SpaceBackground';
import StatCard from '@/components/dashboard/StatCard';
import { Activity, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { analyticsService } from '@/src/services/analytics.service';


const ExecutionTimeline = dynamic(() => import('@/components/dashboard/ExecutionTimeline'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full animate-pulse bg-white/5 rounded-2xl border border-white/10" />
});
const LanguageStats = dynamic(() => import('@/components/dashboard/LanguageStats'), {
  ssr: false,
  loading: () => <div className="h-[350px] w-full animate-pulse bg-white/5 rounded-2xl border border-white/10" />
});
const RecentExecutionsTable = dynamic(() => import('@/components/dashboard/RecentExecutionsTable'), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await analyticsService.getDashboardStats();
        setMetrics(data);
      } catch (error) {
        if (!error.message.includes('401')) {
          console.error('Failed to load dashboard metrics', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen pt-24 lg:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SpaceBackground />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white tracking-wide">Platform Dashboard</h1>
            <p className="text-muted mt-1">Real-time metrics and execution telemetry.</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 size={48} className="animate-spin text-primary" />
            </div>
          ) : !metrics ? (
            <div className="text-center text-gray-500 py-12">Failed to load analytics data.</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Runs" value={metrics.totalExecutions.toLocaleString()} icon={Activity} colorClass="from-blue-500 to-indigo-500" itemVariants={itemVariants} />
                <StatCard title="Successful Runs" value={metrics.successfulExecutions.toLocaleString()} icon={CheckCircle} colorClass="from-emerald-400 to-green-600" itemVariants={itemVariants} />
                <StatCard title="Failed Runs" value={metrics.failedExecutions.toLocaleString()} icon={XCircle} colorClass="from-red-500 to-orange-500" itemVariants={itemVariants} />
                <StatCard title="Avg. Runtime" value={`${metrics.avgExecutionTime}ms`} icon={Clock} colorClass="from-purple-500 to-pink-500" itemVariants={itemVariants} />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ExecutionTimeline itemVariants={itemVariants} data={metrics.executionTrend} />
                </div>
                <div className="lg:col-span-1">
                  <LanguageStats itemVariants={itemVariants} data={metrics.languagesUsed} />
                </div>
              </div>

              {/* Table Row */}
              <RecentExecutionsTable itemVariants={itemVariants} data={metrics.recentActivity} />

            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
