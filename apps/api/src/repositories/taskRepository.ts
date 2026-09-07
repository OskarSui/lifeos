import { prisma } from '../lib/prisma.js';
import type { CreateTaskInput, UpdateTaskInput } from '../types/task.js';

export const taskRepository = {
  findMany(userId?: string) {
    return prisma.task.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

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

  findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  update(id: string, input: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: input,
    });
  },
};
