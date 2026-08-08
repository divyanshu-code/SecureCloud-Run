import { Queue, QueueEvents, Worker } from 'bullmq';
import { redisClient } from './redis.js';

/**
 * Reusable connection configuration for BullMQ instances.
 * We pass the pre-configured ioredis singleton (redisClient) here.
 * Reusing the connection reduces overhead and prevents max-connection errors on Redis.
 */
const connection = redisClient;

import { config } from './env.js';

/**
 * Helper to create a fully configured BullMQ Queue.
 * A Queue is used by the producer to add jobs (e.g. from a controller).
 * 
 * @param {string} queueName - Unique identifier for the queue.
 * @returns {Queue} The configured BullMQ Queue instance.
 */
export const createQueue = (queueName) => {
  return new Queue(queueName, {
    connection,
    defaultJobOptions: {
      attempts: config.queue.attempts,             // Dynamically configurable retries
      backoff: {
        type: 'exponential',                       // Wait increasingly longer between retries
        delay: config.queue.backoffDelayMs,        // Dynamically configurable starting delay
      },
      removeOnComplete: true,                      // Keep Redis memory clean by deleting successful jobs
      
      // DEAD LETTER QUEUE (DLQ) READY:
      // When jobs fail their maximum number of retries, they are marked as 'failed' in BullMQ.
      // By using removeOnFail: { count: 1000 }, we effectively use BullMQ's native failed 
      // set as our Dead Letter Queue. We retain the last 1000 failed jobs for manual inspection, 
      // debugging, or manual retry, preventing infinite memory leaks.
      removeOnFail: {
        count: 1000, 
      },
    },
  });
};

/**
 * Helper to create a QueueEvents listener.
 * This is used to listen to global events emitted by the queue
 * (e.g., job completed, job failed, job progress) across all workers.
 * 
 * @param {string} queueName - The name of the queue to listen to.
 * @returns {QueueEvents} The configured QueueEvents instance.
 */
export const createQueueEvents = (queueName) => {
  return new QueueEvents(queueName, { connection });
};

/**
 * Helper to create a Worker.
 * A Worker is the consumer that takes jobs off the queue and processes them.
 * 
 * @param {string} queueName - The name of the queue to consume from.
 * @param {Function} processor - The async function that executes the job logic.
 * @param {Object} options - Additional worker options (like concurrency).
 * @returns {Worker} The configured BullMQ Worker instance.
 */
export const createWorker = (queueName, processor, options = {}) => {
  return new Worker(queueName, processor, {
    connection,
    concurrency: options.concurrency || 5, // Process up to 5 jobs concurrently by default
    ...options,
  });
};
