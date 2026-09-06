import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';
import type { ApiErrorResponse } from '../types/api-response.js';

const isProduction = process.env.NODE_ENV === 'production';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction
        ? 'Internal server error'
        : err instanceof Error
          ? err.message
          : 'Unknown error',
    },
  };

  res.status(500).json(response);
};
