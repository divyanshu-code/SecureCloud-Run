import { analyticsService } from '../services/analytics.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const analyticsController = {
  getDashboardMetrics: catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const metrics = await analyticsService.getDashboardMetrics(userId);
    ApiResponse.sendSuccess(res, 200, 'Dashboard metrics retrieved successfully', metrics);
  }),
};
