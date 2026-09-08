import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '../lib/prisma.js';
import { taskRepository } from './taskRepository.js';

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const mockedPrisma = vi.mocked(prisma, { deep: true });

const userId = '550e8400-e29b-41d4-a716-446655440000';
const taskId = '660e8400-e29b-41d4-a716-446655440000';
const goalId = '770e8400-e29b-41d4-a716-446655440000';

const task = {
  id: taskId,
  userId,
  goalId,
  title: 'Build LifeOS API',
  description: 'Implement repository',
  status: 'INBOX' as const,
  priority: 'HIGH' as const,
  dueDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('taskRepository.create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a task with the provided data', async () => {
    mockedPrisma.task.create.mockResolvedValue(task);

    const input = {
      userId,
      title: 'Build LifeOS API',
      description: 'Implement repository',
      priority: 'HIGH' as const,
      goalId,
    };

    const result = await taskRepository.create(input);

    expect(mockedPrisma.task.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: 'Build LifeOS API',
        description: 'Implement repository',
        priority: 'HIGH',
        goalId,
        dueDate: undefined,
      },
    });

    expect(result).toEqual(task);
  });
});

describe('taskRepository.findMany', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('finds tasks using the provided filters', async () => {
    mockedPrisma.task.findMany.mockResolvedValue([task]);

    const query = {
      userId,
      status: 'INBOX' as const,
      priority: 'HIGH' as const,
      goalId,
    };

    const result = await taskRepository.findMany(query);

    expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        status: 'INBOX',
        priority: 'HIGH',
        goalId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    expect(result).toEqual([task]);
  });

  it('finds all user tasks when optional filters are missing', async () => {
    mockedPrisma.task.findMany.mockResolvedValue([task]);

    await taskRepository.findMany({
      userId,
    });

    expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        status: undefined,
        priority: undefined,
        goalId: undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
});

describe('taskRepository.findById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('finds a task by id and userId', async () => {
    mockedPrisma.task.findFirst.mockResolvedValue(task);

    const result = await taskRepository.findById(taskId, userId);

    expect(mockedPrisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: taskId,
        userId,
      },
    });

    expect(result).toEqual(task);
  });

  it('returns null when the task does not exist', async () => {
    mockedPrisma.task.findFirst.mockResolvedValue(null);

    const result = await taskRepository.findById(taskId, userId);

    expect(result).toBeNull();
  });
});

describe('taskRepository.update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates an existing task', async () => {
    const updatedTask = {
      ...task,
      title: 'Updated LifeOS task',
    };

    const tx = {
      task: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
    };

    tx.task.findFirst.mockResolvedValue(task);
    tx.task.update.mockResolvedValue(updatedTask);

    mockedPrisma.$transaction.mockImplementation(async (callback) =>
      callback(tx as never),
    );

    const input = {
      title: 'Updated LifeOS task',
      priority: 'MEDIUM' as const,
    };

    const result = await taskRepository.update(taskId, userId, input);

    expect(tx.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: taskId,
        userId,
      },
    });

    expect(tx.task.update).toHaveBeenCalledWith({
      where: {
        id: taskId,
      },
      data: input,
    });

    expect(result).toEqual(updatedTask);
  });

  it('returns null when the task does not belong to the user', async () => {
    const tx = {
      task: {
        findFirst: vi.fn(),
        update: vi.fn(),
      },
    };

    tx.task.findFirst.mockResolvedValue(null);

    mockedPrisma.$transaction.mockImplementation(async (callback) =>
      callback(tx as never),
    );

    const result = await taskRepository.update(taskId, userId, {
      title: 'Updated task',
    });

    expect(result).toBeNull();

    expect(tx.task.update).not.toHaveBeenCalled();
  });
});

describe('taskRepository.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a task belonging to the user', async () => {
    mockedPrisma.task.deleteMany.mockResolvedValue({
      count: 1,
    });

    const result = await taskRepository.delete(taskId, userId);

    expect(mockedPrisma.task.deleteMany).toHaveBeenCalledWith({
      where: {
        id: taskId,
        userId,
      },
    });

    expect(result).toEqual({
      count: 1,
    });
  });

  it('returns count 0 when the task does not exist', async () => {
    mockedPrisma.task.deleteMany.mockResolvedValue({
      count: 0,
    });

    const result = await taskRepository.delete(taskId, userId);

    console.log('Result delete:', result);

    expect(result).toEqual({
      count: 0,
    });
  });
});
