import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { executionQueue } from '../queues/execution.queue.js';

// Initialize the Express adapter for Bull Board
export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Create the Bull Board interface
createBullBoard({
  queues: [
    new BullMQAdapter(executionQueue),
    // Future queues (e.g., emailQueue, cleanupQueue) can be added here
  ],
  serverAdapter: serverAdapter,
});

/**
 * Placeholder middleware to protect the Bull Board dashboard.
 * In a production environment, this should verify admin credentials
 * via JWT, Basic Auth, or an internal network check (VPC).
 */
export const adminAuthMiddleware = (req, res, next) => {
  // TODO: Implement actual admin role verification here.
  // For now, we allow access to facilitate local development.
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    // In production, block it by default until auth is implemented
    return res.status(403).send('Forbidden: Admin Dashboard Authentication Required');
  }
  next();
};
