import { Router } from 'express';
import {
  createTask,
  listTasks,
  updateTask,
} from '../controllers/taskController.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema.js';
import { taskQuerySchema } from '../schemas/taskQuerySchema.js';

const router = Router();

router.get('/', validateQuery(taskQuerySchema), listTasks);
router.post('/', validateBody(createTaskSchema), createTask);
router.patch('/:id', validateBody(updateTaskSchema), updateTask);

export default router;
