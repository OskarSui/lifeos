import type { RequestHandler } from 'express';
import { taskService } from '../services/taskService.js';

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const task = await taskService.createTask({
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      goalId: req.body.goalId,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
