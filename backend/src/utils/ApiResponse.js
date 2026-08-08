export class ApiResponse {
  /**
   * Send a standard success response.
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object|Array} [data={}] - Response payload
   */
  static sendSuccess(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a standard error response.
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object|Array} [errorDetails={}] - Additional error details (mapped to data)
   */
  static sendError(res, statusCode, message, errorDetails = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: errorDetails, // Maps error details (e.g. stack trace, validation arrays) to 'data'
    });
  }

  /**
   * Send a validation error response.
   * @param {Object} res - Express response object
   * @param {Array} validationErrors - Array of Zod or Joi validation errors
   */
  static sendValidation(res, validationErrors) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      data: validationErrors,
    });
  }

  /**
   * Send a paginated success response.
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Array} data - Paginated data array
   * @param {Object} meta - Pagination metadata (page, limit, total, etc.)
   */
  static sendPagination(res, statusCode, message, data, meta) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: {
        items: data,
        meta,
      },
    });
  }
}
