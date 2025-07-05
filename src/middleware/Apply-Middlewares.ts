// src/middleware/apply-middleware.ts
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

export function applyGlobalMiddleware(app: Application): void {
 
  app.use(cors());

 

  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
}
