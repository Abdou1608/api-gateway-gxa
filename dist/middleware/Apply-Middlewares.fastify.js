"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyGlobalMiddlewarePlugin = void 0;
const applyGlobalMiddlewarePlugin = async (app) => {
    // MIGRATION: place ici les équivalents Fastify de tes middlewares globaux
    // Exemple: compression / headers sécurité si besoin
    // await app.register((await import('@fastify/compress')).default, { global: true });
    app.log.info('Global middlewares (Fastify) appliqués');
};
exports.applyGlobalMiddlewarePlugin = applyGlobalMiddlewarePlugin;
