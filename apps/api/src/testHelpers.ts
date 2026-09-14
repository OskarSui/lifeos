import { expect } from 'vitest';

import type { TaskResponse } from './types/task.js';

export function taskResponse(task: TaskResponse) {
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
