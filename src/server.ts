/// <reference path="./types/fastify.d.ts" />
/// <reference path="./types/dotenv-safe.d.ts" />

import Fastify, { type FastifyInstance } from 'fastify';
import * as dotenvSafe from 'dotenv-safe';
import { Env, EnvSchema } from './types/env';
import security from './plugins/security';
import swagger from './plugins/swagger';
import errors from './plugins/error-handler';
import health from './routes/health';
import proxy from './routes/proxy';
import expressPlugin from '@fastify/express';
import express from 'express';
import { registerRoutes as registerExpressRoutes } from './routes/fonctionnalite.routes';

async function start() {
  const app = Fastify({ logger: { transport: { target: 'pino-pretty' } } }) as FastifyInstance & { config: Env };
  dotenvSafe.config({ allowEmptyValues: false, example: '.env.example' });
  app.decorate('config', EnvSchema.parse(process.env));

  await app.register(security);
  await app.register(swagger);
  await app.register(errors);
  await app.register(health);
  await app.register(proxy);

  // IntÃ©gration des routes Express existantes (avec parseur JSON)
  await app.register(expressPlugin);
  const exApp = express();
  exApp.use(express.json({ limit: '2mb' }));
  exApp.use(express.urlencoded({ extended: true }));
  registerExpressRoutes(exApp);
  app.use(exApp);

  const port = Number(app.config.PORT ?? 8080);
  try {
    await app.listen({ port, host: '51.44.168.49' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
start();
