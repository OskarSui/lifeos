import type { Request, Response, NextFunction } from 'express';

import { goalService } from '../services/goalService.js';

export async function createGoal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, title, description } = req.body as {
      userId: string;
      title: string;
      description?: string;
    };

    const goal = await goalService.createGoal({
      userId,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGoals(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.query.userId as string;

    const status = req.query.status as
      'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | undefined;

    const goals = await goalService.getGoals({
      userId,
      status,
    });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
}

export async function getGoalById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;

    const userId = req.query.userId as string;

    const goal = await goalService.getGoalById(id, userId);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGoal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;

    const userId = req.query.userId as string;

    const input = req.body as {
      title?: string;
      description?: string | null;
      status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    };

    const goal = await goalService.updateGoal(id, userId, input);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteGoal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;

    const userId = req.query.userId as string;

    await goalService.deleteGoal(id, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
