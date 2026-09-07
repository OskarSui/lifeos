import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { validateBody } from './validate.js';
import { createTaskSchema } from '../schemas/taskSchema.js';
import { AppError } from '../errors/AppError.js';

describe('validateBody', () => {
  it('calls next without error for valid data', () => {
    const req = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Build LifeOS API',
        priority: 'HIGH',
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    const middleware = validateBody(createTaskSchema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });

  it('replaces body with validated data', () => {
    const req = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        title: '  Build LifeOS API  ',
        priority: 'HIGH',
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    const middleware = validateBody(createTaskSchema);

    middleware(req, res, next);

    expect(req.body).toEqual({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Build LifeOS API',
      priority: 'HIGH',
    });
  });

  it('calls next with AppError for invalid data', () => {
    const req = {
      body: {
        userId: 'invalid-id',
        title: '',
        priority: 'SUPER_IMPORTANT',
      },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    const middleware = validateBody(createTaskSchema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();

    const error = next.mock.calls[0]?.[0];

    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  });
});
