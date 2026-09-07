import { Router } from 'express';
import {
  createTask,
  getTaskById,
  getTasks,
} from '../controllers/taskController.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createTaskSchema,
  getTasksQuerySchema,
  taskIdSchema,
} from '../schemas/taskSchema.js';
import { validateParams } from '../middleware/validateParams.js';

const router = Router();

router.get('/', validateQuery(getTasksQuerySchema), getTasks);

router.get(
  '/:id',
  validateParams(taskIdSchema),
  validateQuery(getTasksQuerySchema),
  getTaskById,
);

router.post('/', validateBody(createTaskSchema), createTask);

export default router;
