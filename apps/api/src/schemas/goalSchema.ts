import { z } from 'zod';

export const createGoalSchema = z.object({
  userId: z.uuid(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
});

export type CreateGoalRequest = z.infer<typeof createGoalSchema>;

export const getGoalsQuerySchema = z.object({
  userId: z.uuid(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
});

export type GetGoalsQuery = z.infer<typeof getGoalsQuerySchema>;

export const goalIdSchema = z.object({
  id: z.uuid(),
});

export type GoalIdParams = z.infer<typeof goalIdSchema>;

export const updateGoalSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),

    description: z.string().trim().max(5000).nullable().optional(),

    status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateGoalRequest = z.infer<typeof updateGoalSchema>;
