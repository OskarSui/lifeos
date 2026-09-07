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

export const getTasksQuerySchema = z.object({
  userId: z.uuid(),
  status: z.enum(['INBOX', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  goalId: z.uuid().optional(),
});

export const taskIdSchema = z.object({
  id: z.uuid(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    status: z.enum(['INBOX', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    goalId: z.uuid().nullable().optional(),
    dueDate: z.iso
      .datetime()
      .transform((value) => new Date(value))
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
export type TaskIdParams = z.infer<typeof taskIdSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
