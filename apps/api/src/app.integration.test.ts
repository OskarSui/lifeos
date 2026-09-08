import 'dotenv/config';

import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { app } from './app.js';
import { prisma } from './lib/prisma.js';

const createdUserIds: string[] = [];

async function createUserWithTasks(taskTitles: string[]) {
  const user = await prisma.user.create({
    data: {
      email: `integration-${Date.now()}-${Math.random().toString(16).slice(2)}@lifeos.local`,
      name: 'Integration User',
    },
  });

  createdUserIds.push(user.id);

  const tasks = await Promise.all(
    taskTitles.map((title, index) =>
      prisma.task.create({
        data: {
          userId: user.id,
          title,
          description: `Task ${index + 1}`,
          status: index === 0 ? 'INBOX' : 'IN_PROGRESS',
          priority: index % 2 === 0 ? 'HIGH' : 'LOW',
          createdAt: new Date(Date.now() + index * 1000),
        },
      }),
    ),
  );

  return { user, tasks };
}

async function cleanupUsers() {
  for (const userId of createdUserIds) {
    await prisma.task.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
  }

  createdUserIds.length = 0;
}

describe('Integration: GET /api/v1/tasks', () => {
  beforeEach(async () => {
    await cleanupUsers();
  });

  afterEach(async () => {
    await cleanupUsers();
  });

  it('returns all tasks for a user in descending created order', async () => {
    console.log('--- integration test start ---');

    const { user, tasks } = await createUserWithTasks([
      'First task',
      'Second task',
    ]);

    console.log('Created user:', user.id);
    console.log(
      'Created tasks:',
      tasks.map((task) => ({ id: task.id, title: task.title })),
    );

    expect(tasks).toHaveLength(2);

    const [firstTask, secondTask] = tasks;

    console.log('Calling GET /api/v1/tasks with userId:', user.id);

    const response = await request(app)
      .get('/api/v1/tasks')
      .query({ userId: user.id })
      .expect(200);

    console.log('API response body:', JSON.stringify(response.body, null, 2));

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(
      response.body.data.map((task: { title: string }) => task.title),
    ).toEqual([secondTask!.title, firstTask!.title]);

    expect(response.body.data[0]).toMatchObject({
      userId: user.id,
      status: 'IN_PROGRESS',
      priority: 'LOW',
      title: 'Second task',
    });

    console.log('--- integration test end ---');
  });
});
