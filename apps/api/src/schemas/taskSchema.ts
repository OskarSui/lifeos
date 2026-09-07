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
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
