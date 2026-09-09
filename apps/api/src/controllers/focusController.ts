import type { Request, Response, NextFunction } from 'express';

import { focusService } from '../services/focusService.js';

export async function getTodayFocus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.query.userId as string;

    const focus = await focusService.getToday(userId);

    res.status(200).json({
      success: true,
      data: focus,
    });
  } catch (error) {
    next(error);
  }
}

export async function setTodayFocus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId, taskId } = req.body as {
      userId: string;
      taskId: string;
    };

    const focus = await focusService.setToday(userId, taskId);

    res.status(200).json({
      success: true,
      data: focus,
    });
  } catch (error) {
    next(error);
  }
}
