import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { JOB_STATUSES } from '../constants/job.constants.js';
// Import socket manager removed to ensure modularity
import { logger } from '../utils/logger.js';
import { executionQueue } from '../queues/execution.queue.js';

export const jobService = {
  async executeJob({ code, language, userId }) {
    // 1. Save job with PENDING status
    const job = await prisma.job.create({
      data: {
        code,
        language,
        userId,
        status: JOB_STATUSES.PENDING,
      },
    });

    // 2. Delegate to BullMQ
    // We add the job to the queue. The worker will pick it up asynchronously.
    // We pass the internal DB ID so the worker can report progress back.
    await executionQueue.add('execute-code', {
      jobId: job.id,
      code,
      language,
      userId,
    });

    // 3. Calculate Estimated Queue Position
    const waitingCount = await executionQueue.getWaitingCount();

    logger.info({ 
      event: 'job_created',
      dbJobId: job.id, 
      language,
      queueSize: waitingCount 
    }, 'Job successfully created and delegated to BullMQ execution queue');

    // 4. Immediately return the pending job details
    return {
      jobId: job.id,
      status: job.status,
      estimatedQueuePosition: waitingCount, // If there are 5 waiting, this is essentially #6 in line
    };
  },

  async updateJobStatus(jobId, status) {
    const data = { status };
    
    if (status === JOB_STATUSES.RUNNING) {
      data.startedAt = new Date();
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data,
    });

    return job;
  },

  async storeExecutionResult(jobId, output, executionTimeMs, error = null) {
    const status = error ? JOB_STATUSES.FAILED : JOB_STATUSES.COMPLETED;
    
    let finalOutput = output || error;
    
    // If output is an object (like the full result payload), stringify it so we can extract it later
    if (typeof finalOutput === 'object' && finalOutput !== null) {
      finalOutput = JSON.stringify(finalOutput);
    }

    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status,
        output: finalOutput,
        completedAt: new Date(),
        executionTimeMs,
      },
    });

    return job;
  },

  async getJobById(jobId, userId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) throw new AppError('Job not found', 404);
    if (job.userId !== userId) throw new AppError('Forbidden. You do not own this job.', 403);

    return await this.formatJobResponse(job);
  },

  async getHistory(userId, { page = 1, limit = 10, language, status, search, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const where = { userId };
    
    if (language) {
      where.language = language;
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { language: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { output: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.job.count({ where })
    ]);
    
    const formattedJobs = await Promise.all(jobs.map(job => this.formatJobResponse(job)));
    
    return {
      data: formattedJobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  },

  async getActiveJobs(userId) {
    const jobs = await prisma.job.findMany({
      where: { 
        userId,
        status: { in: [JOB_STATUSES.PENDING, JOB_STATUSES.RUNNING] } 
      },
      orderBy: { createdAt: 'asc' },
    });
    
    return Promise.all(jobs.map(job => this.formatJobResponse(job)));
  },

  async formatJobResponse(job) {
    // Map PENDING to Waiting for the frontend API response
    let displayStatus = job.status === JOB_STATUSES.PENDING ? 'Waiting' : job.status;
    
    // Capitalize strictly per user requirements
    displayStatus = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).toLowerCase();

    let queuePosition = null;
    if (job.status === JOB_STATUSES.PENDING) {
      // Get estimated queue position if it's still waiting
      queuePosition = await executionQueue.getWaitingCount();
    }

    let parsedOutput = job.output;
    let metrics = null;
    
    if (job.output) {
      try {
        const parsed = JSON.parse(job.output);
        if (parsed && typeof parsed === 'object') {
          // It's our structured metrics object
          parsedOutput = parsed.output; // Extract just the text output for backwards compat
          metrics = parsed; // Expose full metrics
        }
      } catch (e) {
        // Was just a raw string
      }
    }

    return {
      id: job.id,
      language: job.language,
      status: displayStatus,
      executionTimeMs: job.executionTimeMs || null,
      output: job.status === JOB_STATUSES.COMPLETED ? parsedOutput : null,
      error: job.status === JOB_STATUSES.FAILED ? parsedOutput : null,
      metrics,
      queuePosition,
      createdAt: job.createdAt,
    };
  },

  async deleteJob(jobId, userId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.userId !== userId) {
      throw new AppError('Forbidden. You do not own this job.', 403);
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return null;
  },
};
