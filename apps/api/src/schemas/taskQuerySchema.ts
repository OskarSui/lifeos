import { z } from 'zod';

export const taskQuerySchema = z.object({
  userId: z.uuid().optional(),
});

export type TaskQuery = z.infer<typeof taskQuerySchema>;
