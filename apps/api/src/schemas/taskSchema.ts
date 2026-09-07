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
