import express from 'express';
import cors from 'cors';

import { prisma } from './lib/prisma.js';
import { env } from './config/env.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import taskRoutes from './routes/taskRoutes.js';

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);

app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        database: 'ok',
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
