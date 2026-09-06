import express from 'express';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
  });
});

app.get('/test-error', () => {
  throw new Error('This is a test error');
});

app.use(notFoundHandler);
app.use(errorHandler);
