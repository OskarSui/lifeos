import { Router } from 'express';
import { createTask, getTasks } from '../controllers/taskController.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import {
  createTaskSchema,
  getTasksQuerySchema,
} from '../schemas/taskSchema.js';

const router = Router();

router.get('/', validateQuery(getTasksQuerySchema), getTasks);
router.post('/', validateBody(createTaskSchema), createTask);

export default router;
