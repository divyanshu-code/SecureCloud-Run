import { api } from '../lib/api/axios';

class AnalyticsService {
  /**
   * Fetches the dashboard metrics for the current user.
   * Includes total executions, success rates, languages used, execution trends, and recent activity.
   * 
   * @returns {Promise<Object>} Dashboard metrics data
   */
  async getDashboardStats() {
    const response = await api.get('/api/v1/analytics/dashboard');
    return response.data || response;
  }
}

export const analyticsService = new AnalyticsService();
