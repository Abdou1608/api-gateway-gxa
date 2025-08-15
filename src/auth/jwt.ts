import type { FastifyRequest } from 'fastify';
import { createHmac } from 'crypto';
export function verifyJwt(req: FastifyRequest) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const secret = ((req.server as any).config?.JWT_SECRET as string) || '';
  const fake = createHmac('sha256', secret).update('payload').digest('hex');
  return token === fake ? { sub: 'demo' } : null;
}
