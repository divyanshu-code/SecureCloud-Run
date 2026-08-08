import { jobService } from './job.service.js';
import { getExecutorClass } from '../executors/executor.registry.js';
import { JOB_STATUSES } from '../constants/job.constants.js';
import { logger } from '../utils/logger.js';
import { emitToUser } from '../sockets/socket.manager.js';

export const executionService = {
  /**
   * Process a job payload from BullMQ.
   * 
   * This service handles the entire business logic lifecycle:
   * Status updates, finding the executor, running the code, handling errors,
   * saving to PostgreSQL, and broadcasting to the user via Socket.IO.
   * 
   * @param {Object} job - The BullMQ job object
   * @returns {Object} The standardized execution result
   */
  async processJob(job) {
    const { code, language, userId, jobId: dbJobId } = job.data;
    const workerId = job.worker ? job.worker.id : 'unknown-worker';

    // 1. Update Status to Running in Database
    await jobService.updateJobStatus(dbJobId, JOB_STATUSES.RUNNING);

    // Emit Socket.IO Event
    emitToUser(userId, 'job:running', { jobId: dbJobId, status: JOB_STATUSES.RUNNING });

    // 2. Find Executor
    const ExecutorClass = getExecutorClass(language);
    if (!ExecutorClass) {
      const errorMsg = `Unsupported programming language: ${language}`;
      await jobService.storeExecutionResult(dbJobId, null, 0, errorMsg);
      emitToUser(userId, 'job:failed', { jobId: dbJobId, error: errorMsg });
      throw new Error(errorMsg); // System error: fails the BullMQ job
    }

    // 3. Execute Code
    const executor = new ExecutorClass();
    const result = await executor.execute(code);

    // 4. Return Result & Update Database
    if (result.isError) {
      const errorMsg = result.systemError || result.stderr || 'Execution failed';
      // Pass the full result object so it gets stringified and stored for detailed metrics
      await jobService.storeExecutionResult(dbJobId, result, result.executionTimeMs, errorMsg);
      
      // Emit Socket.IO Event
      emitToUser(userId, 'job:failed', { 
        jobId: dbJobId, 
        output: result.output, 
        error: errorMsg,
        executionTimeMs: result.executionTimeMs 
      });
      
      // Only throw if it was an infrastructure failure (triggers BullMQ retry)
      if (result.systemError) {
        throw new Error(`Infrastructure Failure: ${result.systemError}`);
      }
      
      return result;
    }

    // Success path - pass full result object
    await jobService.storeExecutionResult(dbJobId, result, result.executionTimeMs, null);

    // Emit Socket.IO Event
    emitToUser(userId, 'job:completed', { 
      jobId: dbJobId, 
      output: result.output, 
      executionTimeMs: result.executionTimeMs 
    });

    return result;
  }
};
