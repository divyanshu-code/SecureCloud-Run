import prisma from '../config/db.js';

export const analyticsService = {
  async getDashboardMetrics(userId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const baseWhere = {
      userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    };

    // 1. Top Level Metrics (Executions and Time)
    const [totalExecutions, successfulExecutions, failedExecutions, avgTimeResult] = await Promise.all([
      prisma.job.count({ where: baseWhere }),
      prisma.job.count({ where: { ...baseWhere, status: 'COMPLETED' } }),
      prisma.job.count({ where: { ...baseWhere, status: 'FAILED' } }),
      prisma.job.aggregate({
        where: { ...baseWhere, status: 'COMPLETED' },
        _avg: {
          executionTimeMs: true,
        },
      }),
    ]);

    // 2. Languages Used
    const languageGroups = await prisma.job.groupBy({
      by: ['language'],
      where: baseWhere,
      _count: {
        language: true,
      },
      orderBy: {
        _count: {
          language: 'desc',
        }
      }
    });

    const languagesUsed = languageGroups.map(group => ({
      name: group.language,
      value: group._count.language
    }));

    // 3. Execution Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get raw data for the last 7 days
    const recentJobs = await prisma.job.findMany({
      where: {
        userId,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by day (YYYY-MM-DD)
    const trendMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i + 1); // +1 because we want to include today
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = { date: d.toLocaleDateString('en-US', { weekday: 'short' }), runs: 0, failures: 0 };
    }

    recentJobs.forEach(job => {
      const dateStr = job.createdAt.toISOString().split('T')[0];
      if (trendMap[dateStr]) {
        trendMap[dateStr].runs += 1;
        if (job.status === 'FAILED') {
          trendMap[dateStr].failures += 1;
        }
      }
    });

    const executionTrend = Object.values(trendMap);

    // 4. Recent Activity (Latest 5 jobs)
    const recentActivityRaw = await prisma.job.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    
    const recentActivity = recentActivityRaw.map(job => {
      let memoryUsageMb = null;
      if (job.output) {
        try {
          const parsed = JSON.parse(job.output);
          memoryUsageMb = parsed.memoryUsageMb;
        } catch(e) {}
      }
      
      return {
        id: job.id,
        language: job.language,
        status: job.status,
        executionTimeMs: job.executionTimeMs,
        memoryUsageMb,
        createdAt: job.createdAt
      };
    });

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      avgExecutionTime: Math.round(avgTimeResult._avg.executionTimeMs || 0),
      languagesUsed,
      executionTrend,
      recentActivity
    };
  }
};
