import { api } from '../lib/api/axios';

/**
 * Execution API Service
 * 
 * Handles all network requests related to submitting, polling, and managing 
 * code execution jobs via the backend infrastructure.
 */
class ExecutionService {
  /**
   * Submits code to the execution queue.
   * 
   * @param {string} language - The programming language (e.g. 'python', 'javascript')
   * @param {string} sourceCode - The raw source code to execute
   * @returns {Promise<Object>} The server response containing jobId, status, and queue position
   */
  async submitJob(language, sourceCode) {
    // Map 'sourceCode' to 'code' to match backend executeJobSchema validation
    const response = await api.post('/api/v1/jobs/execute', {
      language,
      code: sourceCode
    });
    
    return response.data || response;
  }

  /**
   * Fetches the full detailed payload for a specific job.
   * 
   * @param {string} jobId - The UUID of the job
   * @returns {Promise<Object>} The detailed job metrics and output
   */
  async getJob(jobId) {
    const response = await api.get(`/api/v1/jobs/${jobId}`);
    return response.data || response;
  }

  /**
   * Fetches execution history with pagination, sorting, and filtering.
   * 
   * @param {Object} params - Query params (page, limit, language, status, search)
   * @returns {Promise<Object>} The history data and pagination metadata
   */
  async getHistory(params = {}) {
    const response = await api.get('/api/v1/jobs/history', { params });
    return response.data || response;
  }

  /**
   * Deletes a specific job from history.
   * 
   * @param {string} jobId - The UUID of the job
   * @returns {Promise<void>}
   */
  async deleteHistory(jobId) {
    const response = await api.delete(`/api/v1/jobs/history/${jobId}`);
    return response.data || response;
  }
}

export const executionService = new ExecutionService();
