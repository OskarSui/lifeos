const port = Number(process.env.PORT ?? 3000);

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number');
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
