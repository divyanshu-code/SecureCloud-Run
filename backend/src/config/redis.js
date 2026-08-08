import Redis from 'ioredis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let currentStatus = 'connecting';

/**
 * Redis Client Configuration using ioredis
 * 
 * We use ioredis because it is the recommended client for BullMQ,
 * offering robust clustering, sentinel support, and advanced connection handling.
 */
const redisOptions = {
  host: config.redis.host,         // The Redis server host (e.g., 'localhost' or an IP/domain)
  port: config.redis.port,         // The Redis server port (default is 6379)
  password: config.redis.password, // Authentication password, if any (important for production)
  
  // Connection Timeout Configuration
  connectTimeout: 10000,           // Time in milliseconds to wait for a connection before failing (10 seconds)
  
  // Automatic Reconnect Strategy
  // This function dictates how the client should behave when disconnected.
  // It receives the number of times it has tried to reconnect (times).
  retryStrategy: (times) => {
    // Max delay between retries is 2 seconds (2000 ms)
    // The delay grows exponentially: 50ms, 100ms, 150ms... up to a max of 2s.
    const delay = Math.min(times * 50, 2000);
    logger.warn({ attempt: times, nextDelay: delay }, 'Redis reconnecting...');
    return delay; // Return the number of ms to wait before the next attempt
  },
  
  // Maximum number of reconnect attempts before giving up.
  // Setting this ensures the app doesn't hang indefinitely in a broken state.
  maxRetriesPerRequest: null,         // BullMQ requires this to be null
};

// Instantiate the reusable client singleton
export const redisClient = new Redis(redisOptions);

// ---------------------------------------------------------
// Event Listeners for Observability
// ---------------------------------------------------------

/**
 * Emitted when the client establishes a connection to the Redis server 
 * and is ready to receive commands.
 */
redisClient.on('ready', () => {
  currentStatus = 'connected';
  logger.info('Redis connection successfully established and ready');
});

/**
 * Emitted when the client encounters a connection error.
 * This is crucial for catching network failures or bad credentials.
 */
redisClient.on('error', (err) => {
  currentStatus = 'error';
  logger.error({ err }, 'Redis connection error encountered');
});

/**
 * Emitted when the client is disconnected from the Redis server.
 * This can happen during network blips or server restarts.
 */
redisClient.on('end', () => {
  currentStatus = 'disconnected';
  logger.warn('Redis connection disconnected');
});

/**
 * Emitted during the reconnecting process.
 */
redisClient.on('reconnecting', () => {
  currentStatus = 'reconnecting';
  logger.info('Redis client attempting to reconnect...');
});

/**
 * Get current Redis connection status for health checks.
 */
export const getRedisStatus = () => {
  // We can also double check the actual client status natively
  if (redisClient.status === 'ready') return 'connected';
  if (redisClient.status === 'end') return 'disconnected';
  return currentStatus;
};
