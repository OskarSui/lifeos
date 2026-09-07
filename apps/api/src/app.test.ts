import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { app } from './app.js';
import { prisma } from './lib/prisma.js';

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
      data: {
        id: task.id,
        userId: task.userId,
        goalId: null,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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
      data: [
        {
          id: task.id,
          userId: task.userId,
          goalId: null,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: null,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        },
      ],
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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

    expect(mockedPrisma.task.findMany).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app).get('/api/v1/tasks').expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

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
      data: {
        id: task.id,
        userId: task.userId,
        goalId: null,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
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

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

    expect(mockedPrisma.task.findFirst).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is missing', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');

    expect(mockedPrisma.task.findFirst).not.toHaveBeenCalled();
  });
});
