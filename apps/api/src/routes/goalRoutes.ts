import { Router } from 'express';

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';

import { validateBody } from '../middleware/validate.js';
import { validateQuery } from '../middleware/validateQuery.js';
import { validateParams } from '../middleware/validateParams.js';

import {
  createGoalSchema,
  getGoalsQuerySchema,
  goalIdSchema,
  updateGoalSchema,
} from '../schemas/goalSchema.js';

const router = Router();

router.get('/', validateQuery(getGoalsQuerySchema), getGoals);

router.post('/', validateBody(createGoalSchema), createGoal);

router.get(
  '/:id',
  validateQuery(
    getGoalsQuerySchema.pick({
      userId: true,
    }),
  ),
  validateParams(goalIdSchema),
  getGoalById,
);

router.patch(
  '/:id',
  validateQuery(getGoalsQuerySchema.pick({ userId: true })),
  validateParams(goalIdSchema),
  validateBody(updateGoalSchema),
  updateGoal,
);

router.delete(
  '/:id',
  validateQuery(
    getGoalsQuerySchema.pick({
      userId: true,
    }),
  ),
  validateParams(goalIdSchema),
  deleteGoal,
);

export default router;
