import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
export default fp(async (app) => {
  if (app.config.SWAGGER_ENABLE === 'true') {
    await app.register(swagger, { openapi: { info: { title: 'GXA API Gateway', version: '1.0.0' } } });
    await app.register(swaggerUi, { routePrefix: '/docs' });
  }
});
