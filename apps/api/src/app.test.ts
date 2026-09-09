import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { app } from './app.js';
import { prisma } from './lib/prisma.js';
import { expectValidationError, taskResponse } from './testHelpers.js';

vi.mock('./lib/prisma.js', () => ({
  prisma: {
    $queryRaw: vi.fn(),
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

const task = {
  id: '660e8400-e29b-41d4-a716-446655440000',
  userId,
  goalId: null,
  title: 'Build LifeOS API',
  description: 'Implement task API',
  status: 'INBOX' as const,
  priority: 'HIGH' as const,
  dueDate: null,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GET /health', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 when API and database are healthy', async () => {
    mockedPrisma.$queryRaw.mockResolvedValue([
      {
        '?column?': 1,
      },
    ]);

    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'ok',
        database: 'ok',
      },
    });
  });
});

describe('POST /api/v1/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a task and returns 201', async () => {
    mockedPrisma.task.create.mockResolvedValue(task);

    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: 'Build LifeOS API',
        description: 'Implement task API',
        priority: 'HIGH',
      })
      .expect(201);

    expect(response.body).toEqual({
      success: true,
      data: taskResponse(task),
    });

    expect(mockedPrisma.task.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: 'Build LifeOS API',
        description: 'Implement task API',
        priority: 'HIGH',
        goalId: undefined,
        dueDate: undefined,
      },
    });
  });

  it('trims the task title', async () => {
    mockedPrisma.task.create.mockResolvedValue({
      ...task,
      title: 'Build LifeOS API',
    });

    await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: '   Build LifeOS API   ',
      })
      .expect(201);

    expect(mockedPrisma.task.create).toHaveBeenCalledWith({
      data: {
        userId,
        title: 'Build LifeOS API',
        description: undefined,
        priority: undefined,
        goalId: undefined,
        dueDate: undefined,
      },
    });
  });

  it('returns 400 for invalid userId', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId: 'invalid-user-id',
        title: 'Build LifeOS API',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.create).not.toHaveBeenCalled();
  });

  it('returns 400 for an empty title', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: '',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.create).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid priority', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: 'Build LifeOS API',
        priority: 'SUPER_IMPORTANT',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.create).not.toHaveBeenCalled();
  });

  it('returns 400 when title exceeds 200 characters', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: 'a'.repeat(201),
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.create).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid dueDate', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        userId,
        title: 'Build LifeOS API',
        dueDate: 'tomorrow',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all tasks for a user', async () => {
    mockedPrisma.task.findMany.mockResolvedValue([task]);

    const response = await request(app)
      .get('/api/v1/tasks')
      .query({
        userId,
      })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: [taskResponse(task)],
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

  it('filters tasks by status', async () => {
    mockedPrisma.task.findMany.mockResolvedValue([task]);

    await request(app)
      .get('/api/v1/tasks')
      .query({
        userId,
        status: 'INBOX',
      })
      .expect(200);

    expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        status: 'INBOX',
        priority: undefined,
        goalId: undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('filters tasks by priority', async () => {
    mockedPrisma.task.findMany.mockResolvedValue([task]);

    await request(app)
      .get('/api/v1/tasks')
      .query({
        userId,
        priority: 'HIGH',
      })
      .expect(200);

    expect(mockedPrisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId,
        status: undefined,
        priority: 'HIGH',
        goalId: undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('returns 400 for an invalid status', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .query({
        userId,
        status: 'INVALID',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.findMany).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app).get('/api/v1/tasks').expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.findMany).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a task by id', async () => {
    mockedPrisma.task.findFirst.mockResolvedValue(task);

    const response = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: taskResponse(task),
    });

    expect(mockedPrisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: task.id,
        userId,
      },
    });
  });

  it('returns 404 when task does not exist', async () => {
    mockedPrisma.task.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });
  });

  it('returns 400 for an invalid task id', async () => {
    const response = await request(app)
      .get('/api/v1/tasks/not-a-uuid')
      .query({
        userId,
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.findFirst).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.task.findFirst).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/v1/tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates a task title', async () => {
    const updatedTask = {
      ...task,
      title: 'Updated LifeOS task',
    };

    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(task),
          update: vi.fn().mockResolvedValue(updatedTask),
        },
      };

      return callback(tx as never);
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        title: '  Updated LifeOS task  ',
      })
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: taskResponse(updatedTask),
    });
  });

  it('updates task status', async () => {
    const updatedTask = {
      ...task,
      status: 'IN_PROGRESS' as const,
    };

    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(task),
          update: vi.fn().mockResolvedValue(updatedTask),
        },
      };

      return callback(tx as never);
    });

    await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        status: 'IN_PROGRESS',
      })
      .expect(200);

    expect(mockedPrisma.$transaction).toHaveBeenCalledOnce();
  });

  it('updates multiple task fields', async () => {
    const updatedTask = {
      ...task,
      title: 'Finish LifeOS MVP',
      status: 'IN_PROGRESS' as const,
      priority: 'LOW' as const,
      description: 'Updated description',
    };

    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(task),
          update: vi.fn().mockResolvedValue(updatedTask),
        },
      };

      return callback(tx as never);
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        title: 'Finish LifeOS MVP',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        description: 'Updated description',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Finish LifeOS MVP');
    expect(response.body.data.status).toBe('IN_PROGRESS');
    expect(response.body.data.priority).toBe('LOW');
  });

  it('allows clearing goalId with null', async () => {
    const taskWithGoal = {
      ...task,
      goalId: '770e8400-e29b-41d4-a716-446655440000',
    };

    const updatedTask = {
      ...taskWithGoal,
      goalId: null,
    };

    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(taskWithGoal),
          update: vi.fn().mockResolvedValue(updatedTask),
        },
      };

      return callback(tx as never);
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        goalId: null,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.goalId).toBeNull();
  });

  it('allows clearing dueDate with null', async () => {
    const dueDate = new Date('2026-09-10T10:00:00.000Z');

    const taskWithDueDate = {
      ...task,
      dueDate,
    };

    const updatedTask = {
      ...taskWithDueDate,
      dueDate: null,
    };

    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(taskWithDueDate),
          update: vi.fn().mockResolvedValue(updatedTask),
        },
      };

      return callback(tx as never);
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        dueDate: null,
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.dueDate).toBeNull();
  });

  it('returns 400 for an invalid status', async () => {
    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        status: 'INVALID_STATUS',
      })
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message:
          'status: Invalid option: expected one of "INBOX"|"IN_PROGRESS"|"DONE"',
      },
    });

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns 400 for an empty update', async () => {
    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({})
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid task id', async () => {
    const response = await request(app)
      .patch('/api/v1/tasks/not-a-uuid')
      .query({
        userId,
      })
      .send({
        title: 'Updated task',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .send({
        title: 'Updated task',
      })
      .expect(400);

    expectValidationError(response);

    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it('returns 404 when task does not belong to the user', async () => {
    mockedPrisma.$transaction.mockImplementation(async (callback) => {
      const tx = {
        task: {
          findFirst: vi.fn().mockResolvedValue(null),
          update: vi.fn(),
        },
      };

      return callback(tx as never);
    });

    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .send({
        title: 'Updated task',
      })
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a task and returns 204', async () => {
    mockedPrisma.task.deleteMany.mockResolvedValue({
      count: 1,
    });

    const response = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .expect(204);

    expect(response.body).toEqual({});

    expect(mockedPrisma.task.deleteMany).toHaveBeenCalledWith({
      where: {
        id: task.id,
        userId,
      },
    });
  });

  it('returns 404 when task does not exist', async () => {
    mockedPrisma.task.deleteMany.mockResolvedValue({
      count: 0,
    });

    const response = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .query({
        userId,
      })
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: 'TASK_NOT_FOUND',
        message: 'Task not found',
      },
    });
  });

  it('returns 400 for an invalid task id', async () => {
    const response = await request(app)
      .delete('/api/v1/tasks/not-a-uuid')
      .query({
        userId,
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

    expect(mockedPrisma.task.deleteMany).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

    expect(mockedPrisma.task.deleteMany).not.toHaveBeenCalled();
  });
});
