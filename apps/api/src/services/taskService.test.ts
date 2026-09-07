import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '@prisma/client';

import { taskRepository } from '../repositories/taskRepository.js';
import { taskService } from './taskService.js';

vi.mock('../repositories/taskRepository.js', () => ({
  taskRepository: {
    create: vi.fn(),
    findMany: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedTaskRepository = vi.mocked(taskRepository);

const userId = '550e8400-e29b-41d4-a716-446655440000';
const taskId = '660e8400-e29b-41d4-a716-446655440000';

const task: Task = {
  id: taskId,
  userId,
  goalId: null,
  title: 'Build LifeOS API',
  description: 'Implement task service',
  status: 'INBOX',
  priority: 'HIGH',
  dueDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('taskService.createTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a task with a trimmed title', async () => {
    mockedTaskRepository.create.mockResolvedValue(task);

    const result = await taskService.createTask({
      userId,
      title: '  Build LifeOS API  ',
      priority: 'HIGH',
    });

    expect(mockedTaskRepository.create).toHaveBeenCalledWith({
      userId,
      title: 'Build LifeOS API',
      priority: 'HIGH',
    });

    expect(result).toEqual(task);
  });

  it('throws an error when title is empty', async () => {
    await expect(
      taskService.createTask({
        userId,
        title: '   ',
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'TASK_TITLE_REQUIRED',
      message: 'Task title is required',
    });

    expect(mockedTaskRepository.create).not.toHaveBeenCalled();
  });

  it('throws an error when title is longer than 200 characters', async () => {
    const longTitle = 'a'.repeat(201);

    await expect(
      taskService.createTask({
        userId,
        title: longTitle,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      code: 'TASK_TITLE_TOO_LONG',
    });

    expect(mockedTaskRepository.create).not.toHaveBeenCalled();
  });
});

describe('taskService.getTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns tasks from the repository', async () => {
    const tasks = [task];

    mockedTaskRepository.findMany.mockResolvedValue(tasks);

    const query = {
      userId,
      status: 'INBOX' as const,
      priority: 'HIGH' as const,
    };

    const result = await taskService.getTasks(query);

    expect(mockedTaskRepository.findMany).toHaveBeenCalledWith(query);
    expect(result).toEqual(tasks);
  });
});

describe('taskService.getTaskById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a task when it exists', async () => {
    mockedTaskRepository.findById.mockResolvedValue(task);

    const result = await taskService.getTaskById(taskId, userId);

    expect(mockedTaskRepository.findById).toHaveBeenCalledWith(taskId, userId);

    expect(result).toEqual(task);
  });

  it('throws TASK_NOT_FOUND when task does not exist', async () => {
    mockedTaskRepository.findById.mockResolvedValue(null);

    await expect(taskService.getTaskById(taskId, userId)).rejects.toMatchObject(
      {
        statusCode: 404,
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    );
  });
});

describe('taskService.updateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates a task with a trimmed title', async () => {
    mockedTaskRepository.update.mockResolvedValue(task);

    const input = {
      title: '  Updated task title  ',
      priority: 'HIGH' as const,
    };

    const result = await taskService.updateTask(taskId, userId, input);

    expect(mockedTaskRepository.update).toHaveBeenCalledWith(taskId, userId, {
      title: 'Updated task title',
      priority: 'HIGH',
    });

    expect(result).toEqual(task);
  });

  it('updates a task without a title', async () => {
    mockedTaskRepository.update.mockResolvedValue(task);

    const input = {
      priority: 'LOW' as const,
      status: 'IN_PROGRESS' as const,
    };

    await taskService.updateTask(taskId, userId, input);

    expect(mockedTaskRepository.update).toHaveBeenCalledWith(
      taskId,
      userId,
      input,
    );
  });

  it('throws TASK_NOT_FOUND when task does not exist', async () => {
    mockedTaskRepository.update.mockResolvedValue(null);

    await expect(
      taskService.updateTask(taskId, userId, {
        title: 'Updated task',
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });
  });
});

describe('taskService.deleteTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes an existing task', async () => {
    mockedTaskRepository.delete.mockResolvedValue({
      count: 1,
    });

    await expect(
      taskService.deleteTask(taskId, userId),
    ).resolves.toBeUndefined();

    expect(mockedTaskRepository.delete).toHaveBeenCalledWith(taskId, userId);
  });

  it('throws TASK_NOT_FOUND when task does not exist', async () => {
    mockedTaskRepository.delete.mockResolvedValue({
      count: 0,
    });

    await expect(taskService.deleteTask(taskId, userId)).rejects.toMatchObject({
      statusCode: 404,
      code: 'TASK_NOT_FOUND',
      message: 'Task not found',
    });
  });
});
