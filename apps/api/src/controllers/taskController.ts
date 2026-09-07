import type { RequestHandler } from 'express';
import { taskService } from '../services/taskService.js';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../schemas/taskSchema.js';
import type { TaskQuery } from '../schemas/taskQuerySchema.js';

type CreateTaskRequestHandler = RequestHandler<
  Record<string, never>,
  unknown,
  CreateTaskRequest
>;

type ListTasksRequestHandler = RequestHandler<
  Record<string, never>,
  unknown,
  unknown,
  TaskQuery
>;

type UpdateTaskRequestHandler = RequestHandler<
  { id: string },
  unknown,
  UpdateTaskRequest
>;

export const listTasks: ListTasksRequestHandler = async (req, res, next) => {
  try {
    const tasks = await taskService.listTasks(req.query.userId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

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

export const updateTask: UpdateTaskRequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
