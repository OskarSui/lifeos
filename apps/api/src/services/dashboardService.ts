import { dashboardRepository } from '../repositories/dashboardRepository.js';
import { getDateString, getTodayRange } from '../utils/date.js';
import type { TodayDashboardResponse } from '../types/dashboard.js';

export const dashboardService = {
  async getToday(userId: string): Promise<TodayDashboardResponse> {
    const { startOfDay, endOfDay } = getTodayRange();

    const [tasks, counts, focus] = await Promise.all([
      dashboardRepository.getTodayTasks(userId, startOfDay, endOfDay),

      dashboardRepository.getTodayCounts(userId),

      dashboardRepository.getTodayFocus(userId, startOfDay, endOfDay),
    ]);

    const percentage =
      counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100);

    return {
      date: getDateString(new Date()),

      focus,

      tasks,

      counts,

      progress: {
        completed: counts.done,
        total: counts.total,
        percentage,
      },
    };
  },
};
