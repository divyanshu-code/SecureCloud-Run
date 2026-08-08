import { ApiResponse } from '../utils/ApiResponse.js';

import { z } from 'zod';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof z.ZodError || error.name === 'ZodError') {
      const issues = error.issues || JSON.parse(error.message);
      const formattedErrors = issues.map((err) => ({
        path: Array.isArray(err.path) ? err.path.join('.') : '',
        message: err.message,
      }));
      return ApiResponse.sendValidation(res, formattedErrors);
    }
    return next(error);
  }
};
