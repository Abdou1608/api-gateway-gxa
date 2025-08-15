import { z } from 'zod';
export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('8080'),
  SWAGGER_ENABLE: z.string().default('true'),
  BROKER_SERVICE_URL: z.string().url(),
  USER_SERVICE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16)
});
export type Env = z.infer<typeof EnvSchema>;
