import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { AppError } from './utils/AppError.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { logger } from './utils/logger.js';
import pinoHttp from 'pino-http';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { healthController } from './controllers/health.controller.js';
import { serverAdapter, adminAuthMiddleware } from './config/bullboard.js';
import session from 'express-session';
import passport from './config/passport.js';

const app = express();

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session and Passport Middleware (Required for OAuth state verification)
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: config.nodeEnv === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// HTTP Request Logging
app.use(pinoHttp({ 
  logger,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 || err) {
      return 'error';
    }
    return 'silent';
  }
}));

// Request Timeout (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      success: false,
      message: 'Request Timeout',
    });
  });
  next();
});

// Basic Health Check
app.get('/api/health', healthController.getHealth);

// Admin Dashboard (Bull Board)
app.use('/admin/queues', adminAuthMiddleware, serverAdapter.getRouter());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
