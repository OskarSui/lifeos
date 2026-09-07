import { Router } from 'express';
import { createTask } from '../controllers/taskController.js';
import { validateBody } from '../middleware/validate.js';
import { createTaskSchema } from '../schemas/taskSchema.js';

const router = Router();

router.post('/', validateBody(createTaskSchema), createTask);

export default router;
