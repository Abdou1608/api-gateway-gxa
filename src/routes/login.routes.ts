import { Router } from 'express';
import { opensession } from '../services/login/opensession';
import { api_loginValidator } from '../validators/api_loginValidator';
import { validateBody } from '../middleware/zodValidator';
import AuthService from '../auth/auth.service';
import env from '../config/env';
import { AuthError, InternalError } from '../common/errors';



const router = Router();

const authService = new AuthService({ defaultTtlSeconds: 1800 });

router.post('/', validateBody(api_loginValidator), async (req, res, next) => {
  const logon: string | undefined = req.body?.login ?? req.body?.username;
  const password: string | undefined = req.body?.password;
  const domain: string | undefined = req.body?.domain;

  console.log('[login] incoming auth request', { user: logon, domain });

  if (logon && password && domain) {
    try {
      const result: unknown = await opensession(logon, password, domain);
      const anyResult = result as any | undefined;
      const SID = (anyResult?.SessionId ?? anyResult?._SessionId) as string | undefined;
      if (!SID) {
        console.error('[login] Missing SessionID in upstream result');
        return next(new InternalError('Missing SessionID from upstream'));
      }

      const key = env.jwtSecret  ?? '';
      if (!key) {
        console.error('[login] Missing JWS_KEY env');
        return next(new InternalError('Server misconfiguration: JWS_KEY is missing'));
      }

      const token = await authService.get_token(key, SID);

      try {
        if (req.session) {
          req.session.bearer = token;
        }
      } catch (e) {
        console.warn('[login] Session not available to store bearer token');
      }

      res.set('Authorization', `Bearer ${token}`);
      return res.json({ ...(anyResult || {}), token});
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[login] Error:', message);
      return next(new InternalError(message));
    }
  } else {
    return next(new AuthError('Données manquantes ou non conforme'));
  }
});

export default router;
// Utilisez `const api = new DefaultApi();` dans vos handlers pour les appels backend
