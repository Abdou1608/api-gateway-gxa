"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fonctionnalit__routes_1 = require("./routes/fonctionnalit\u00E9.routes");
const Apply_Middlewares_1 = require("./middleware/Apply-Middlewares");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
const HOST = '0.0.0.0'; // écoute sur toutes les interfaces réseau
// Application des middlewares
(0, Apply_Middlewares_1.applyGlobalMiddleware)(app);
// Enregistrement des routes
(0, fonctionnalit__routes_1.registerRoutes)(app);
app.listen(PORT, HOST, () => {
    console.log(`🚀 Serveur SOAP REST Gateway démarré sur http://localhost:${PORT}`);
});
