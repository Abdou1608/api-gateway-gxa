import type { FastifyReply, FastifyRequest } from 'fastify';
import AuthService from '../auth/auth.service';
import env from '../config/env';
import { BasSecurityContext } from '../Model/BasSoapObject/BasSecurityContext';

const BEARER = /^Bearer\s+(.+)$/i;
const authService = new AuthService();

type CheckSessionFn = (ctx: BasSecurityContext) => Promise<any>;
let checkSessionInvoker: CheckSessionFn | null = null;

export function __setCheckSessionInvoker(fn?: CheckSessionFn) {
  checkSessionInvoker = fn ?? null;
}

async function getCheckSessionInvoker(): Promise<CheckSessionFn> {
  if (checkSessionInvoker) {
    return checkSessionInvoker;
  }
  const mod = await import('../services/check_session/checksession_.service');
  if (typeof mod.checksession_ !== 'function') {
    throw new Error('checksession_ service must export a function');
  }
  checkSessionInvoker = mod.checksession_;
  return checkSessionInvoker;
}

function extractToken(headers: Record<string, any>, query: any): string | undefined {
  const h = headers['authorization'] || headers['Authorization'];
  if (typeof h === 'string') {
    const m = h.match(BEARER);
    if (m) return m[1];
  }
  if (process.env.NODE_ENV !== 'production' && typeof query?.token === 'string') {
    return query.token;
  }
  return undefined;
}

export async function authPreHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = extractToken(request.headers as any, (request as any).query);
    if (!token) {
      return reply.code(401).send({ error: 'Non autorisé, authentification requise pour traiter' });
    }
    const key = process.env.JWS_KEY ?? env.jwtSecret ?? '';
    if (!key) {
      request.log.error('[authPreHandler] Missing JWS_KEY env');
      return reply.code(503).send({ error: 'Server misconfiguration' });
    }
    const sid = await authService.get_SID(token, key);
    console.warn('=====--------Voici le SID du Auth.fastify:', sid);
    if (!sid) {
      return reply.code(401).send({ error: 'Non autorisé, authentification requise pour traiter' });
    }
     const ctx = new BasSecurityContext();
        ctx.IsAuthenticated = true as any;
        ctx.SessionId = sid;
    const runCheckSession = await getCheckSessionInvoker();
    const result = await runCheckSession(ctx);
    if (!result) {
      return reply.code(402).send({ error: 'Non autorisé, Session invalide ou expirée' });
    }

    (request as any).auth = { sid, token };

    // Map into body for legacy validators: enforce authoritative SID
    const body: any = request.body;
    if (body && typeof body === 'object') {
      body.SessionID = sid;
      body._SessionID = sid;
      body.sessionId = sid;
      body._sessionId = sid;
      if (!body.BasSecurityContext) body.BasSecurityContext = {};
      body.BasSecurityContext._SessionId = sid;
      body.BasSecurityContext.SessionId = sid;
      console.warn('=====--------Voici le Body de la requete de Auth.fastify:', body);
      request.body = body;
    }
  } catch (err) {
    request.log.warn({ err }, '[authPreHandler] Erreur lors de la validation du jeton');
    return reply.code(401).send({ error: { detail: 'Non autorisé, Erreur lors de la validation de votre session', message: err instanceof Error ? err.message : String(err) } });
  }
}

/**
 * Global preValidation hook: applies authPreHandler for protected routes so validators
 * can see the enforced BasSecurityContext before schema validation.
 * Skips public and separately-guarded routes.
 */
export async function authGlobalPreValidation(request: FastifyRequest, reply: FastifyReply) {
  const url = request.url || '';
  // Public endpoints or separately-guarded ones
  if (
    url === '/ping' ||
    url.startsWith('/health') ||
    url.startsWith('/openapi') ||
    url.startsWith('/docs') ||
    url.startsWith('/debug') ||
    url === '/api/login' ||
    url.startsWith('/api/admin') ||
    (process.env.BYPASS_EXPORT_CONVERT_AUTH === '1' && url.startsWith('/api/tools/convert/'))
  ) {
    return; // skip auth
  }
  return authPreHandler(request, reply);
}
