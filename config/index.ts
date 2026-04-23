import { authConfig } from './auth';
import { corsConfig } from './cors';

export const config = {
  auth: authConfig,
  cors: corsConfig,
} as const;
