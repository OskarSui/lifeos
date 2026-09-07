import { prisma } from '../lib/prisma.js';
import { GetTasksQuery } from '../schemas/taskSchema.js';
import type { CreateTaskInput } from '../types/task.js';

export const taskRepository = {
  create(input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        goalId: input.goalId,
        dueDate: input.dueDate,
      },
    });
  },

  findMany(query: GetTasksQuery) {
    return prisma.task.findMany({
      where: {
        userId: query.userId,
        status: query.status,
        priority: query.priority,
        goalId: query.goalId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
};
