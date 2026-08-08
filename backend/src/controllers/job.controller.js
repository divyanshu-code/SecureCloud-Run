import { jobService } from '../services/job.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const jobController = {
  executeJob: catchAsync(async (req, res) => {
    // Inject userId from JWT
    const { code, language } = req.body;
    const userId = req.user.userId;

    const job = await jobService.executeJob({ code, language, userId });
    
    ApiResponse.sendSuccess(res, 202, 'Job queued successfully', job);
  }),

  getJobById: catchAsync(async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.userId;

    const job = await jobService.getJobById(jobId, userId);

    ApiResponse.sendSuccess(res, 200, 'Job retrieved successfully', job);
  }),

  getHistory: catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { page, limit, language, status, search, sortBy, sortOrder } = req.query;
    const historyData = await jobService.getHistory(userId, { 
      page: parseInt(page) || 1, 
      limit: parseInt(limit) || 10,
      language,
      status,
      search,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc'
    });
    ApiResponse.sendSuccess(res, 200, 'Job history retrieved successfully', historyData);
  }),

  getActiveJobs: catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const jobs = await jobService.getActiveJobs(userId);
    ApiResponse.sendSuccess(res, 200, 'Active jobs retrieved successfully', jobs);
  }),

  deleteJob: catchAsync(async (req, res) => {
    const jobId = req.params.id;
    const userId = req.user.userId;

    await jobService.deleteJob(jobId, userId);

    ApiResponse.sendSuccess(res, 204, 'Job deleted successfully');
  }),
};
