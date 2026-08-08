import { Queue } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { config } from '../config/env.js';

export const EXECUTION_QUEUE_NAME = 'execution';

/**
 * Execution Queue Instance
 * 
 * This is the main BullMQ Queue responsible for holding user code execution tasks
 * until a Worker is ready to process them.
 */
export const executionQueue = new Queue(EXECUTION_QUEUE_NAME, {
  // 1. Connection: 
  // We pass our shared ioredis client. If we didn't, BullMQ would create 
  // a brand new Redis connection for this queue, exhausting Redis limits quickly.
  connection: redisClient,

  // 2. Default Job Options:
  // These options automatically apply to every single job added to this queue
  // unless overridden at the time of calling `executionQueue.add()`.
  defaultJobOptions: {
    // Attempts: If a job fails (throws an error), BullMQ will automatically retry it.
    attempts: config.queue.attempts,

    // Backoff: How long to wait before attempting a retry.
    // 'exponential' means the wait time doubles after each failure (e.g., 1s, 2s, 4s).
    // This prevents overwhelming external services (or the Docker daemon) if they are temporarily down.
    backoff: {
      type: 'exponential',
      delay: config.queue.backoffDelayMs, 
    },

    // Remove Completed: Memory management. 
    // Once a job succeeds, we don't need its payload clogging up Redis RAM. 
    // Setting to true instantly deletes the job data from Redis on success.
    removeOnComplete: true,

    // DEAD LETTER QUEUE (DLQ) READY:
    // When jobs fail their maximum number of retries, they are marked as 'failed' natively by BullMQ.
    // By using removeOnFail: { count: 1000 }, we effectively use BullMQ's 'failed' set as our 
    // built-in Dead Letter Queue. We retain the last 1000 crashed jobs for manual inspection, 
    // debugging, or programmatic replay, completely preventing infinite memory leaks.
    removeOnFail: {
      count: 1000,
    },
  },

  // -------------------------------------------------------------
  // Architecture Ready Settings (Documented for Future Use)
  // -------------------------------------------------------------
  // Note: The following features are natively supported by BullMQ and this queue
  // is prepped to handle them when we add jobs.
  //
  // 1. Priority Support:
  // We can add VIP/Premium user jobs with priority:
  // executionQueue.add('exec', data, { priority: 1 }) // 1 is highest priority
  //
  // 2. Delayed Jobs:
  // We can schedule code to run in the future:
  // executionQueue.add('exec', data, { delay: 60000 }) // Runs 60s from now
  //
  // 3. Rate Limiting:
  // While free-tier BullMQ enforces rate limits at the Worker level, 
  // this queue architecture is fully compatible with adding concurrency 
  // controls on the consumer side to ensure we don't crash our Docker host.
});

/**
 * Fetch real-time queue metrics natively from BullMQ.
 * Useful for infrastructure scaling (e.g. Kubernetes HPA) and health checks.
 */
export const getQueueMetrics = async () => {
  try {
    const counts = await executionQueue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed');
    return counts;
  } catch (error) {
    return { error: 'Failed to fetch queue metrics' };
  }
};
