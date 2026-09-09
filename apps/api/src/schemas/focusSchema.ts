import { z } from 'zod';

export const todayFocusQuerySchema = z.object({
  userId: z.uuid(),
});

export const setTodayFocusSchema = z.object({
  userId: z.uuid(),
  taskId: z.uuid(),
});

export type TodayFocusQuery = z.infer<typeof todayFocusQuerySchema>;

export type SetTodayFocusRequest = z.infer<typeof setTodayFocusSchema>;
