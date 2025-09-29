import type { FastifyReply, FastifyRequest, preValidationHookHandler } from 'fastify';
import type { ZodTypeAny } from 'zod';
import { ValidationError } from '../common/errors';

export function validateBodyFastify(schema: ZodTypeAny): preValidationHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      const issues = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      // Mirror centralized error handling
      reply.code(400).send(new ValidationError('Le corps de la requête est invalide.', issues));
      return;
    }
    (request as any).body = result.data;
  };
}
