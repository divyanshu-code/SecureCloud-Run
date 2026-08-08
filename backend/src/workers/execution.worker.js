import { createWorker } from '../config/bullmq.js';
import { EXECUTION_QUEUE_NAME } from '../queues/execution.queue.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';
import { executionService } from '../services/execution.service.js';

/**
 * Execution Worker
 * 
 * This file instantiates the BullMQ Worker that continuously listens to the 
 * 'execution' queue. It is responsible for pulling jobs off Redis and processing them.
 */

const processor = async (job) => {
  const { jobId: dbJobId, language } = job.data;
  const workerId = job.worker ? job.worker.id : 'unknown-worker';
  
  logger.info({ 
    event: 'worker_picked_job',
    bullJobId: job.id, 
    dbJobId, 
    language,
    workerId 
  }, `Worker picked up job`);

  // Delegate entirely to the Execution Service
  return await executionService.processJob(job);
};

/**
 * Worker Configuration Options Explained:
 * 
 * - concurrency: 5 
 *   The worker will pull up to 5 jobs at the exact same time and run them in parallel.
 *   This is essentially our Node.js thread-pool limitation before handing off to Docker.
 * 
 * - lockDuration: 30000 (30 seconds)
 *   When the worker pulls a job, it places a "lock" on it in Redis. If the worker crashes,
 *   the lock expires after 30 seconds and BullMQ knows the job stalled and can retry it.
 * 
 * - removeOnComplete/removeOnFail (not shown here, configured on Queue)
 *   Handled by the Queue configuration to keep Redis clean.
 */
const workerOptions = {
  concurrency: 5,
  lockDuration: 30000,
};

// Instantiate the worker only if enabled via environment configuration.
// This allows API servers to scale independently of Execution nodes.
export let executionWorker = null;

if (config.execution.enableWorker) {
  logger.info('ENABLE_WORKER is true. Starting execution worker...');
  executionWorker = createWorker(EXECUTION_QUEUE_NAME, processor, workerOptions);

  // Attach error handlers to the worker itself to catch infrastructure failures 
  // (e.g. Redis disconnection during processing).
  executionWorker.on('error', (err) => {
    logger.error({ 
      event: 'worker_infrastructure_error',
      err 
    }, 'BullMQ Worker encountered an infrastructure error');
  });

  // Attach failure handler to catch actual job execution crashes
  executionWorker.on('failed', (job, err) => {
    const workerId = executionWorker.id;
    logger.error({ 
      event: 'job_failed',
      bullJobId: job.id,
      dbJobId: job.data?.jobId,
      workerId,
      err 
    }, 'Job execution failed in worker');
  });
} else {
  logger.info('ENABLE_WORKER is false. Worker will not start on this node.');
}

/**
 * Health check helper for the worker.
 */
export const getWorkerHealth = async () => {
  if (!config.execution.enableWorker) {
    return { status: 'disabled' };
  }
  if (!executionWorker) {
    return { status: 'offline' };
  }
  
  const isRunning = executionWorker.isRunning();
  const isPaused = await executionWorker.isPaused();
  
  if (!isRunning) return { status: 'stopped' };
  if (isPaused) return { status: 'paused' };
  return { status: 'running', concurrency: workerOptions.concurrency };
};
