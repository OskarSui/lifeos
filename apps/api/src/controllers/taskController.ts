import type { RequestHandler } from 'express';
import { taskService } from '../services/taskService.js';
import type { CreateTaskRequest } from '../schemas/taskSchema.js';

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as CreateTaskRequest;

    const task = await taskService.createTask(body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
