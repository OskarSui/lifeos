import type { RequestHandler } from 'express';
import { taskService } from '../services/taskService.js';
import {
  getTasksQuerySchema,
  TaskIdParams,
  type CreateTaskRequest,
  type GetTasksQuery,
  type UpdateTaskRequest,
} from '../schemas/taskSchema.js';

type CreateTaskRequestHandler = RequestHandler<
  Record<string, never>,
  unknown,
  CreateTaskRequest
>;

type GetTasksRequestHandler = RequestHandler<
  Record<string, never>,
  unknown,
  GetTasksQuery
>;

type GetTaskRequestHandler = RequestHandler<
  TaskIdParams,
  unknown,
  unknown,
  GetTasksQuery
>;

type UpdateTaskRequestHandler = RequestHandler<
  TaskIdParams,
  unknown,
  UpdateTaskRequest,
  GetTasksQuery
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

export const getTasks: GetTasksRequestHandler = async (req, res, next) => {
  try {
    const query = getTasksQuerySchema.parse(req.query);

    const tasks = await taskService.getTasks(query);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById: GetTaskRequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.query.userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask: UpdateTaskRequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.query.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
