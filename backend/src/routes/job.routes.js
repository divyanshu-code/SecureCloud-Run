import { Router } from 'express';
import { jobController } from '../controllers/job.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { executeJobSchema } from '../validators/job.validator.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all job routes with JWT middleware
router.use(requireAuth);

router.post('/execute', validateRequest(executeJobSchema), jobController.executeJob);
router.get('/jobs', jobController.getActiveJobs);
router.get('/history', jobController.getHistory);
router.get('/:id', jobController.getJobById);
router.delete('/history/:id', jobController.deleteJob);

export default router;
