import dotenv from 'dotenv';

// Load environment variables early
dotenv.config();

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  jwtSecret: string;
  soapTimeoutMs: number;
  soapRetries: number;
  soapBackoffMs: number;
  userQueueConcurrency: number;
}

function number(name: string, def: number): number {
  const raw = process.env[name];
  if (!raw) return def;
  const n = Number(raw);
  return Number.isFinite(n) ? n : def;
}

const config: AppConfig = {
  port: number('PORT', 3000),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  soapTimeoutMs: number('SOAP_TIMEOUT_MS', 15000),
  soapRetries: number('SOAP_RETRIES', 2),
  soapBackoffMs: number('SOAP_BACKOFF_MS', 400),
  userQueueConcurrency: number('USER_QUEUE_CONCURRENCY', 2),
};

export default config;