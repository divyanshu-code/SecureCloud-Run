import prisma from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { catchAsync } from '../utils/catchAsync.js';
import { getRedisStatus } from '../config/redis.js';
import { getQueueMetrics } from '../queues/execution.queue.js';
import { getWorkerHealth } from '../workers/execution.worker.js';

export const healthController = {
  getHealth: catchAsync(async (req, res) => {
    let dbStatus = 'disconnected';
    
    try {
      // Perform a raw query to ensure DB is genuinely responding
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
    }

    // Get Redis status
    const redisStatus = getRedisStatus();
    
    // Get BullMQ Metrics & Worker Status
    const queueMetrics = await getQueueMetrics();
    const workerStatus = await getWorkerHealth();

    const healthData = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        bullmq: {
          worker: workerStatus,
          metrics: queueMetrics
        }
      }
    };

    // If critical infrastructure is down, fail the health check
    if (dbStatus === 'error' || redisStatus === 'disconnected' || redisStatus === 'error') {
      return ApiResponse.sendError(res, 503, 'Service Unavailable - Critical Infrastructure Down', healthData);
    }

    ApiResponse.sendSuccess(res, 200, 'SecureCloud Run Backend is operational', healthData);
  }),
};
