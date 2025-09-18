import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: {
      sid: string;
      token?: string;
      claims?: Record<string, unknown>;
    };
  }
}