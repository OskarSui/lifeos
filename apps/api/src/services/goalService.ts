import { AppError } from '../errors/AppError.js';

import { goalRepository } from '../repositories/goalRepository.js';

import type {
  CreateGoalInput,
  GetGoalsQuery,
  UpdateGoalInput,
} from '../types/goal.js';

export const goalService = {
  async createGoal(input: CreateGoalInput) {
    const title = input.title.trim();

    if (!title) {
      throw new AppError('Goal title is required', 400, 'GOAL_TITLE_REQUIRED');
    }

    if (title.length > 200) {
      throw new AppError(
        'Goal title must not exceed 200 characters',
        400,
        'GOAL_TITLE_TOO_LONG',
      );
    }

    return goalRepository.create({
      ...input,
      title,
    });
  },

  async getGoals(query: GetGoalsQuery) {
    return goalRepository.findMany(query);
  },

  async getGoalById(id: string, userId: string) {
    const goal = await goalRepository.findById(id, userId);

    if (!goal) {
      throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');
    }

    return goal;
  },

  async updateGoal(id: string, userId: string, input: UpdateGoalInput) {
    const updateData = {
      ...input,
    };

    if (updateData.title !== undefined) {
      updateData.title = updateData.title.trim();
    }

    const goal = await goalRepository.update(id, userId, updateData);

    if (!goal) {
      throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');
    }

    return goal;
  },

  async deleteGoal(id: string, userId: string) {
    const result = await goalRepository.delete(id, userId);

    if (result.count === 0) {
      throw new AppError('Goal not found', 404, 'GOAL_NOT_FOUND');
    }
  },
};
