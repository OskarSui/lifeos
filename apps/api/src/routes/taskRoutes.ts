import { Router } from 'express';
import { createTask, listTasks } from '../controllers/taskController.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { createTaskSchema } from '../schemas/taskSchema.js';
import { taskQuerySchema } from '../schemas/taskQuerySchema.js';

const router = Router();

router.get('/', validateQuery(taskQuerySchema), listTasks);
router.post('/', validateBody(createTaskSchema), createTask);

export default router;
