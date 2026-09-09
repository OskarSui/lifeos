import { Router } from 'express';

import {
  getTodayFocus,
  setTodayFocus,
} from '../controllers/focusController.js';

import { validateQuery } from '../middleware/validateQuery.js';
import { validateBody } from '../middleware/validate.js';

import {
  todayFocusQuerySchema,
  setTodayFocusSchema,
} from '../schemas/focusSchema.js';

const router = Router();

router.get('/today', validateQuery(todayFocusQuerySchema), getTodayFocus);

router.put('/today', validateBody(setTodayFocusSchema), setTodayFocus);

export default router;
