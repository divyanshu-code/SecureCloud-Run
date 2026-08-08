import { AppError } from '../utils/AppError.js';
import { config } from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

const handlePrismaError = (err) => {
  logger.warn({ err }, 'Prisma Error Intercepted');
  if (err.code === 'P2002') {
    const target = err.meta?.target || 'Field';
    return new AppError(`Duplicate field value: ${target}. Please use another value.`, 409);
  }
  if (err.code === 'P2025') {
    return new AppError('Record not found.', 404);
  }
  // Generic Prisma Database error
  return new AppError('Database operation failed.', 400);
};

const handleJWTError = () => {
  logger.warn('Invalid JWT Signature Intercepted');
  return new AppError('Invalid token! Please log in again.', 401);
};

const handleJWTExpiredError = () => {
  logger.warn('Expired JWT Intercepted');
  return new AppError('Your token has expired! Please log in again.', 401);
};

const sendErrorDev = (err, res) => {
  ApiResponse.sendError(res, err.statusCode, err.message, {
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    ApiResponse.sendError(res, err.statusCode, err.message);
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error({ err }, 'Unhandled Exception');
    ApiResponse.sendError(res, 500, 'Something went very wrong!');
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name, code: err.code };

    if (error.name === 'PrismaClientKnownRequestError') error = handlePrismaError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
