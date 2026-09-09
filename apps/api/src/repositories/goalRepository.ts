import { prisma } from '../lib/prisma.js';

import type {
  CreateGoalInput,
  GetGoalsQuery,
  UpdateGoalInput,
} from '../types/goal.js';

export const goalRepository = {
  create(input: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
      },
    });
  },

  findMany(query: GetGoalsQuery) {
    return prisma.goal.findMany({
      where: {
        userId: query.userId,
        status: query.status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findById(id: string, userId: string) {
    return prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  async update(id: string, userId: string, input: UpdateGoalInput) {
    return prisma.$transaction(async (tx) => {
      const goal = await tx.goal.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!goal) {
        return null;
      }

      return tx.goal.update({
        where: {
          id,
        },
        data: input,
      });
    });
  },

  async delete(id: string, userId: string) {
    return prisma.goal.deleteMany({
      where: {
        id,
        userId,
      },
    });
  },
};
