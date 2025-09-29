declare module './middleware/Apply-Middlewares.fastify' {
  export const applyGlobalMiddlewarePlugin: any;
}

declare module './middleware/error-handler.fastify' {
  export function buildErrorHandlers(): { setNotFound: any; setError: any };
}

declare module './observability/metrics.fastify' {
  export const metricsPlugin: any;
}

declare module './routes/fonctionnalite.routes.fastify' {
  export const registerRoutes: any;
}
