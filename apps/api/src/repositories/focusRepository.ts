import { prisma } from '../lib/prisma.js';

export const focusRepository = {
  async findToday(userId: string, startOfDay: Date, endOfDay: Date) {
    return prisma.dailyFocus.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });
  },

  async setToday(userId: string, taskId: string, date: Date) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({
        where: {
          id: taskId,
          userId,
        },
      });

      if (!task) {
        return null;
      }

      return tx.dailyFocus.upsert({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
        create: {
          userId,
          taskId,
          date,
        },
        update: {
          taskId,
        },
        include: {
          task: {
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              priority: true,
              dueDate: true,
            },
          },
        },
      });
    });
  },
};
