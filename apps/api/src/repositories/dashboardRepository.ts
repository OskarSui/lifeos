import { prisma } from '../lib/prisma.js';

export const dashboardRepository = {
  async getTodayTasks(userId: string, startOfDay: Date, endOfDay: Date) {
    return prisma.task.findMany({
      where: {
        userId,
        OR: [
          {
            dueDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            status: {
              not: 'DONE',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        completedAt: true,
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          priority: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  },

  async getTodayCounts(userId: string) {
    const [total, inbox, inProgress, done] = await Promise.all([
      prisma.task.count({
        where: { userId },
      }),

      prisma.task.count({
        where: {
          userId,
          status: 'INBOX',
        },
      }),

      prisma.task.count({
        where: {
          userId,
          status: 'IN_PROGRESS',
        },
      }),

      prisma.task.count({
        where: {
          userId,
          status: 'DONE',
        },
      }),
    ]);

    return {
      total,
      inbox,
      inProgress,
      done,
    };
  },

  async getTodayFocus(userId: string, startOfDay: Date, endOfDay: Date) {
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
            completedAt: true,
          },
        },
      },
    });
  },
};
