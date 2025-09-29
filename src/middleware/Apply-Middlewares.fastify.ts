import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

export const applyGlobalMiddlewarePlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  // MIGRATION: place ici les équivalents Fastify de tes middlewares globaux
  // Exemple: compression / headers sécurité si besoin
  // await app.register((await import('@fastify/compress')).default, { global: true });
  app.log.info('Global middlewares (Fastify) appliqués');
};
