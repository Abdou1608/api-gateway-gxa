"use strict";
/// <reference path="./types/fastify.d.ts" />
/// <reference path="./types/dotenv-safe.d.ts" />
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenvSafe = __importStar(require("dotenv-safe"));
const env_1 = require("./types/env");
const security_1 = __importDefault(require("./plugins/security"));
const swagger_1 = __importDefault(require("./plugins/swagger"));
const error_handler_1 = __importDefault(require("./plugins/error-handler"));
const health_1 = __importDefault(require("./routes/health"));
const proxy_1 = __importDefault(require("./routes/proxy"));
const express_1 = __importDefault(require("@fastify/express"));
const express_2 = __importDefault(require("express"));
const fonctionnalite_routes_1 = require("./routes/fonctionnalite.routes");
async function start() {
    const app = (0, fastify_1.default)({ logger: { transport: { target: 'pino-pretty' } } });
    dotenvSafe.config({ allowEmptyValues: false, example: '.env.example' });
    app.decorate('config', env_1.EnvSchema.parse(process.env));
    await app.register(security_1.default);
    await app.register(swagger_1.default);
    await app.register(error_handler_1.default);
    await app.register(health_1.default);
    await app.register(proxy_1.default);
    // IntÃ©gration des routes Express existantes (avec parseur JSON)
    await app.register(express_1.default);
    const exApp = (0, express_2.default)();
    exApp.use(express_2.default.json({ limit: '2mb' }));
    exApp.use(express_2.default.urlencoded({ extended: true }));
    (0, fonctionnalite_routes_1.registerRoutes)(exApp);
    app.use(exApp);
    const port = Number(app.config.PORT ?? 8080);
    try {
        await app.listen({ port, host: '51.44.168.49' });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
