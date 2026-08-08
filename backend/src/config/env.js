import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  databaseUrl: process.env.DATABASE_URL,
  
  // OAuth Config
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
  githubClientId: process.env.GITHUB_CLIENT_ID || 'placeholder',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
  sessionSecret: process.env.SESSION_SECRET || 'fallback_session_secret',
  
  // Redis Queue Config (Placeholder)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  // Execution Engine Limits
  execution: {
    enableWorker: process.env.ENABLE_WORKER === 'true', // Allows running API-only nodes
    maxMemoryMb: process.env.EXECUTION_MEMORY_MB || 256,
    maxCpuCores: process.env.EXECUTION_CPU_CORES || 0.5,
    timeoutMs: process.env.EXECUTION_TIMEOUT_MS || 10000,
  },

  // BullMQ Job Queue Config
  queue: {
    attempts: parseInt(process.env.QUEUE_JOB_ATTEMPTS || '3', 10),
    backoffDelayMs: parseInt(process.env.QUEUE_JOB_BACKOFF_DELAY || '1000', 10),
  }
};
