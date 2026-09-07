import { AppError } from '../errors/AppError.js';
import { taskRepository } from '../repositories/taskRepository.js';
import type {
  CreateTaskInput,
  GetTasksQuery,
  UpdateTaskInput,
} from '../types/task.js';

export const taskService = {
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

  async getTasks(query: GetTasksQuery) {
    return taskRepository.findMany(query);
  },

  async getTaskById(id: string, userId: string) {
    const task = await taskRepository.findById(id, userId);

    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return task;
  },

  async updateTask(id: string, userId: string, input: UpdateTaskInput) {
    if (input.title !== undefined) {
      input.title = input.title.trim();
    }

    const task = await taskRepository.update(id, userId, input);

    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return task;
  },

  async deleteTask(id: string, userId: string) {
    const result = await taskRepository.delete(id, userId);

    if (result.count === 0) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
  },
};
