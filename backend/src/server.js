import http from 'http';
import app from './app.js';
import prisma from './config/db.js';
import { config } from './config/env.js';
import { initSocket } from './sockets/socket.manager.js';
import { logger } from './utils/logger.js';
import { executionQueue } from './queues/execution.queue.js';
import { executionWorker } from './workers/execution.worker.js';
import { redisClient } from './config/redis.js';

// Import Queue Events Listener to track global job lifecycles
import './events/execution.events.js';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const serverInstance = server.listen(config.port, () => {
  logger.info(`SecureCloud Run backend running on http://localhost:${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

/**
 * Unified Graceful Shutdown Manager
 * Orchestrates safely draining resources before killing the process.
 */
const gracefulShutdown = async (signal) => {
  logger.info(`👋 ${signal} RECEIVED. Initiating graceful shutdown sequence...`);

  try {
    // 1. Stop accepting new HTTP requests and Socket.io connections
    await new Promise((resolve) => {
      serverInstance.close(() => {
        logger.info('HTTP Server closed (no longer accepting new requests).');
        resolve();
      });
    });

    // 2. Safely drain the BullMQ Worker (if it is running on this node)
    if (executionWorker) {
      logger.info('🛑 Draining BullMQ Worker (waiting for active jobs to finish)...');
      await executionWorker.close();
      logger.info('✅ BullMQ Worker safely shut down.');
    } else {
      logger.info('⏩ BullMQ Worker is disabled on this node. Skipping.');
    }

    // 3. Close the BullMQ Queue
    await executionQueue.close();
    logger.info('BullMQ Queue safely closed.');

    // 4. Disconnect Redis
    await redisClient.quit();
    logger.info('Redis connection closed.');

    // 5. Disconnect PostgreSQL
    await prisma.$disconnect();
    logger.info('PostgreSQL connection closed.');

    logger.info('Process successfully terminated!');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error occurred during graceful shutdown');
    process.exit(1);
  }
};

// Catch Uncaught Exceptions immediately
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'UNHANDLED REJECTION! 💥 Triggering graceful shutdown...');
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Graceful Shutdown on SIGTERM (e.g., Docker stopping container, Heroku/Render scale down)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Graceful Shutdown on SIGINT (e.g., Ctrl+C in terminal)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
