import { z } from 'zod';

export const todayDashboardQuerySchema = z.object({
  userId: z.uuid(),
});

export type TodayDashboardQuery = z.infer<typeof todayDashboardQuerySchema>;
