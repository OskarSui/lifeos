import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError.js';
import { taskRepository } from '../repositories/taskRepository.js';
import type { CreateTaskInput, UpdateTaskInput } from '../types/task.js';

export const taskService = {
  listTasks(userId?: string) {
    return taskRepository.findMany(userId);
  },

  async createTask(input: CreateTaskInput) {
    const title = input.title.trim();

    if (!title) {
      throw new AppError('Task title is required', 400, 'TASK_TITLE_REQUIRED');
    }

    if (title.length > 200) {
      throw new AppError(
        'Task title must not exceed 200 characters',
        400,
        'TASK_TITLE_TOO_LONG',
      );
    }

    return taskRepository.create({
      ...input,
      title,
    });
  },

  async updateTask(id: string, input: UpdateTaskInput) {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    if (input.title !== undefined && !input.title.trim()) {
      throw new AppError('Task title is required', 400, 'TASK_TITLE_REQUIRED');
    }

    try {
      return await taskRepository.update(id, {
        ...input,
        title: input.title?.trim(),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new AppError(
            'Referenced goal was not found',
            400,
            'GOAL_NOT_FOUND',
          );
        }

        if (error.code === 'P2025') {
          throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
        }
      }

      throw error;
    }
  },
};
