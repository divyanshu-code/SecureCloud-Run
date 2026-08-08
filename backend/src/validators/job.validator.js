import { z } from 'zod';
import { JOB_STATUSES } from '../constants/job.constants.js';

// Matches the JobStatus enum in Prisma schema
const JobStatus = z.enum(Object.values(JOB_STATUSES));

export const executeJobSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Code snippet is required'),
    language: z.string().min(1, 'Language is required'),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    status: JobStatus,
    output: z.string().optional(),
    executionTimeMs: z.number().int().nonnegative().optional(),
  }),
});
