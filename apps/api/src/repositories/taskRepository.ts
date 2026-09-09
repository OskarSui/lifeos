import { prisma } from '../lib/prisma.js';
import { GetTasksQuery } from '../schemas/taskSchema.js';
import type { CreateTaskInput, UpdateTaskData } from '../types/task.js';

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

  findById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  async update(id: string, userId: string, input: UpdateTaskData) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!task) {
        return null;
      }

      return tx.task.update({
        where: {
          id,
        },
        data: input,
      });
    });
  },

  async delete(id: string, userId: string) {
    return prisma.task.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },
};
