import { AppError } from '../errors/AppError.js';
import { focusRepository } from '../repositories/focusRepository.js';
import { getTodayRange } from '../utils/date.js';

export const focusService = {
  async getToday(userId: string) {
    const { startOfDay, endOfDay } = getTodayRange();

    return focusRepository.findToday(userId, startOfDay, endOfDay);
  },

  async setToday(userId: string, taskId: string) {
    const { startOfDay } = getTodayRange();

    const focus = await focusRepository.setToday(userId, taskId, startOfDay);

    if (!focus) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return focus;
  },
};
