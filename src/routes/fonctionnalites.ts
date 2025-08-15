import type { FastifyInstance } from 'fastify';
import health from './health';
import proxy from './proxy';

export default async function routes(app: FastifyInstance) {
  await app.register(health);
  // Import dynamique : respecte votre fichier existant src/routes/login.routes.ts
  try {
    const mod = await import('./login.routes');
    const login = (mod as any).default ?? mod;
    await app.register(login as any);
  } catch (err) {
    app.log.warn('login.routes.ts introuvable ou invalide â€“ /api/login ignorÃ©');
  }
  await app.register(proxy);
}
