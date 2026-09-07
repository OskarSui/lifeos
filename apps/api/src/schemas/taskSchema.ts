import { z } from 'zod';

export const createTaskSchema = z.object({
  userId: z.uuid(),

  title: z.string().trim().min(1).max(200),

  description: z.string().trim().max(5000).optional(),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),

  goalId: z.uuid().optional(),

  dueDate: z.iso
    .datetime()
    .transform((value) => new Date(value))
    .optional(),
});

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;

export const getTasksQuerySchema = z.object({
  userId: z.uuid(),

  status: z.enum(['INBOX', 'IN_PROGRESS', 'DONE']).optional(),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),

  goalId: z.uuid().optional(),
});

export const taskIdSchema = z.object({
  id: z.uuid(),
});

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

export type TaskIdParams = z.infer<typeof taskIdSchema>;
