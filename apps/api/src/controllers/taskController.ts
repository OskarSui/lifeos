import type { RequestHandler } from 'express';
import { taskService } from '../services/taskService.js';
import type { CreateTaskRequest } from '../schemas/taskSchema.js';

type CreateTaskRequestHandler = RequestHandler<
  Record<string, never>,
  unknown,
  CreateTaskRequest
>;

export const createTask: CreateTaskRequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
