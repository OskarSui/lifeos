import type { Task } from '@prisma/client';
import { expect } from 'vitest';

export function taskResponse(task: Task) {
  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function expectValidationError(response: {
  body: {
    success: boolean;
    error: { code: string };
  };
}) {
  expect(response.body).toMatchObject({
    success: false,
    error: { code: 'VALIDATION_ERROR' },
  });
}
