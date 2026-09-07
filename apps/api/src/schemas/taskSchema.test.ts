import { describe, expect, it } from 'vitest';
import { createTaskSchema } from './taskSchema.js';

describe('createTaskSchema', () => {
  it('accepts a valid task', () => {
    const result = createTaskSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Build LifeOS API',
      description: 'Implement task validation',
      priority: 'HIGH',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid userId', () => {
    const result = createTaskSchema.safeParse({
      userId: '123',
      title: 'Build LifeOS API',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty title', () => {
    const result = createTaskSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      title: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid priority', () => {
    const result = createTaskSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Build LifeOS API',
      priority: 'SUPER_IMPORTANT',
    });

    expect(result.success).toBe(false);
  });

  it('accepts an optional dueDate', () => {
    const result = createTaskSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Build LifeOS API',
      dueDate: '2026-09-10T10:00:00.000Z',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.dueDate).toBeInstanceOf(Date);
    }
  });
});
