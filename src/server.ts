import express from 'express';

import { registerRoutes } from './routes/fonctionnalité.routes';
import { applyGlobalMiddleware } from './middleware/Apply-Middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

// Application des middlewares
applyGlobalMiddleware(app);

// Enregistrement des routes
registerRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Serveur SOAP REST Gateway démarré sur http://localhost:${PORT}`);
});
