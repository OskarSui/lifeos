import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/AppError.js';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => {
          const path = issue.path.join('.');
          return `${path}: ${issue.message}`;
        })
        .join('; ');

      next(new AppError(message, 400, 'VALIDATION_ERROR'));

      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => {
          const path = issue.path.join('.');
          return `${path}: ${issue.message}`;
        })
        .join('; ');

      next(new AppError(message, 400, 'VALIDATION_ERROR'));

      return;
    }

    next();
  };
}
