import { config } from 'dotenv';

config();

export const CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  queue: {
    name: 'fetch-queue',
  },
} as const;
