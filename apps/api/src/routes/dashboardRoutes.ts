import { Router } from 'express';

import { getTodayDashboard } from '../controllers/dashboardController.js';

import { validateQuery } from '../middleware/validateQuery.js';

import { todayDashboardQuerySchema } from '../schemas/dashboardSchema.js';

const router = Router();

router.get(
  '/today',
  validateQuery(todayDashboardQuerySchema),
  getTodayDashboard,
);

export default router;
