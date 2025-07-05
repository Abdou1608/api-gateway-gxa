import express from 'express';

import { registerRoutes } from './routes/fonctionnalité.routes';
import { applyGlobalMiddleware } from './middleware/Apply-Middlewares';

const app = express();
const PORT:any =process.env.PORT ?? 3000;
const HOST = '0.0.0.0'; // écoute sur toutes les interfaces réseau

// Application des middlewares
applyGlobalMiddleware(app);

// Enregistrement des routes
registerRoutes(app);

app.listen(PORT,HOST,() => {
  console.log(`🚀 Serveur SOAP REST Gateway démarré sur http://localhost:${PORT}`);
});
