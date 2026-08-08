import { Job } from 'bullmq';
import { createQueueEvents } from '../config/bullmq.js';
import { EXECUTION_QUEUE_NAME, executionQueue } from '../queues/execution.queue.js';
import { logger } from '../utils/logger.js';
import { emitToUser } from '../sockets/socket.manager.js';

/**
 * Execution Queue Events Listener
 * 
 * QueueEvents listens to Redis Pub/Sub channels to track the lifecycle of jobs globally.
 * Unlike Worker events (which only track jobs processed by that specific worker),
 * QueueEvents tracks jobs across the entire distributed system.
 */
export const executionQueueEvents = createQueueEvents(EXECUTION_QUEUE_NAME);

/**
 * Helper to fetch the Job from Redis and emit an event to the correct user.
 * We fetch directly from BullMQ/Redis instead of PostgreSQL to avoid unnecessary DB load.
 */
const broadcastToUser = async (bullJobId, eventName, payload) => {
  try {
    const job = await Job.fromId(executionQueue, bullJobId);
    if (job && job.data && job.data.userId) {
      emitToUser(job.data.userId, eventName, { ...payload, jobId: job.data.jobId });
    }
  } catch (error) {
    logger.error({ err: error, bullJobId }, 'Failed to broadcast BullMQ event via Socket.IO');
  }
};

// ------------------------------------------------------------------
// Event: 'waiting'
// Occurs when: A job is added to the queue and is waiting for a Worker to pick it up.
// Useful for: Emitting "Pending" status to the frontend.
// ------------------------------------------------------------------
executionQueueEvents.on('waiting', async ({ jobId }) => {
  logger.info({ jobId }, `Job [${jobId}] is waiting in the queue.`);
  await broadcastToUser(jobId, 'job:started', { status: 'Waiting' });
});

// ------------------------------------------------------------------
// Event: 'active'
// Occurs when: A Worker has picked up the job and is actively executing it.
// Useful for: Emitting "Running" status to the frontend.
// ------------------------------------------------------------------
executionQueueEvents.on('active', async ({ jobId, prev }) => {
  logger.info({ jobId }, `Job [${jobId}] is now active and being processed.`);
  await broadcastToUser(jobId, 'job:running', { status: 'Running' });
});

// ------------------------------------------------------------------
// Event: 'completed'
// Occurs when: The Worker successfully finishes processing the job without throwing an error.
// Useful for: Sending the final execution output/results back to the user.
// ------------------------------------------------------------------
executionQueueEvents.on('completed', async ({ jobId, returnvalue }) => {
  logger.info({ jobId }, `Job [${jobId}] successfully completed.`);
  await broadcastToUser(jobId, 'job:completed', { status: 'Completed', result: returnvalue });
});

// ------------------------------------------------------------------
// Event: 'failed'
// Occurs when: The job throws an unhandled error inside the Worker, OR it runs out of retry attempts.
// Useful for: Notifying the user that their code crashed or the sandbox failed.
// ------------------------------------------------------------------
executionQueueEvents.on('failed', async ({ jobId, failedReason }) => {
  logger.error({ jobId, reason: failedReason }, `Job [${jobId}] failed.`);
  await broadcastToUser(jobId, 'job:failed', { status: 'Failed', error: failedReason });
});

// ------------------------------------------------------------------
// Event: 'stalled'
// Occurs when: A Worker unexpectedly crashes or disconnects while processing an active job.
// Useful for: Monitoring severe infrastructure failures (e.g., Docker out-of-memory kills).
// BullMQ will automatically move stalled jobs back to 'waiting' if retry attempts remain.
// ------------------------------------------------------------------
executionQueueEvents.on('stalled', ({ jobId }) => {
  logger.warn({ jobId }, `Job [${jobId}] has stalled. Worker may have crashed.`);
});

// ------------------------------------------------------------------
// Event: 'removed'
// Occurs when: A job is permanently deleted from Redis memory (either manually or via removeOnComplete).
// Useful for: Debugging memory leaks or auditing job cleanup.
// ------------------------------------------------------------------
executionQueueEvents.on('removed', ({ jobId }) => {
  logger.debug({ jobId }, `Job [${jobId}] was permanently removed from Redis.`);
});
