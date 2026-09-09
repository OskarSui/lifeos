import type { Request, Response, NextFunction } from 'express';

import { dashboardService } from '../services/dashboardService.js';

export async function getTodayDashboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.query.userId as string;

    const dashboard = await dashboardService.getToday(userId);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}
