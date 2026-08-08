import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all analytics routes with JWT middleware
router.use(requireAuth);

router.get('/dashboard', analyticsController.getDashboardMetrics);

export default router;
