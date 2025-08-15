import fp from 'fastify-plugin';
export default fp(async (app) => {
  app.setErrorHandler((err, _req, reply) => {
    app.log.error({ err }, 'Unhandled error');
    const status = (err as any).statusCode ?? 500;
    reply.status(status).send({ message: err.message ?? 'Internal Server Error' });
  });
});
